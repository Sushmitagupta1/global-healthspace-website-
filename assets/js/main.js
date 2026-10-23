(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var body = document.body;

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      body.classList.toggle("nav-open");
      var open = body.classList.contains("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll(".nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      body.classList.remove("nav-open");
    });
  });

  var current = window.location.pathname.split("/").pop();
  if (!current) current = "index.html";
  document.querySelectorAll(".nav a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === current) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  var HERO_CONFIG_PATH = "assets/media/hero.json";
  var HERO_HOME_DEFAULT = "assets/images/hero-home.jpg";

  function currentPageName() {
    var file = window.location.pathname.split("/").pop();
    return file || "index.html";
  }

  function initHeroMedia() {
    var hero = document.querySelector(".hero, .page-hero, .error-page");
    if (!hero) return;
    var isHome = hero.classList.contains("hero");

    var layer = hero.querySelector("[data-hero-media]");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "hero-media";
      layer.setAttribute("data-hero-media", "");
      layer.setAttribute("aria-hidden", "true");
      hero.insertBefore(layer, hero.firstChild);
    }
    if (!layer.querySelector(".hero-media-scrim")) {
      var scrim = document.createElement("span");
      scrim.className = "hero-media-scrim";
      layer.appendChild(scrim);
    }

    var show = function () {
      layer.classList.add("is-ready");
      hero.classList.add("has-media");
    };

    var applyImage = function (src) {
      var probe = new Image();
      probe.onload = function () {
        layer.style.backgroundImage = 'url("' + src + '")';
        show();
      };
      probe.src = src;
    };

    var applyVideo = function (src, poster) {
      var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        if (poster) layer.style.backgroundImage = 'url("' + poster + '")';
        show();
        return;
      }
      var video = document.createElement("video");
      video.className = "hero-media-video";
      video.setAttribute("data-hero-video", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");
      video.setAttribute("loop", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("preload", "metadata");
      video.muted = true;
      if (poster) video.setAttribute("poster", poster);
      var source = document.createElement("source");
      source.src = src;
      source.type = "video/mp4";
      video.appendChild(source);
      layer.insertBefore(video, layer.firstChild);
      video.addEventListener("loadeddata", show, { once: true });
      var play = video.play();
      if (play && typeof play.catch === "function") play.catch(function () {});
    };

    var resolve = function (config) {
      var page = currentPageName();
      var entry = (config && config.pages && config.pages[page]) || {};
      var image = entry.image || (config && config.image) || "";
      var video = entry.video || (config && config.video) || "";

      if (video) {
        if (image) {
          layer.style.backgroundImage = 'url("' + image + '")';
          applyVideo(video, image);
        } else {
          applyVideo(video, "");
        }
        return;
      }
      if (image) {
        applyImage(image);
        return;
      }
      if (isHome) applyImage(HERO_HOME_DEFAULT);
    };

    if (!window.fetch) {
      if (isHome) applyImage(HERO_HOME_DEFAULT);
      return;
    }

    fetch(HERO_CONFIG_PATH)
      .then(function (response) {
        return response.ok ? response.json() : null;
      })
      .then(resolve)
      .catch(function () {
        if (isHome) applyImage(HERO_HOME_DEFAULT);
      });
  }

  initHeroMedia();

  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          var suffix = el.getAttribute("data-suffix") || "";
          var duration = 1600;
          var start = null;

          function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased).toString() + suffix;
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          }

          window.requestAnimationFrame(step);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  var parallaxItems = document.querySelectorAll("[data-parallax]");
  if (parallaxItems.length && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", function (event) {
      var x = (event.clientX / window.innerWidth - 0.5) * 2;
      var y = (event.clientY / window.innerHeight - 0.5) * 2;
      parallaxItems.forEach(function (item) {
        var strength = parseFloat(item.getAttribute("data-parallax")) || 10;
        item.style.transform = "translate3d(" + x * strength + "px," + y * strength + "px,0)";
      });
    });
  }

  var reduceMotionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var prefersReducedMotion = !!(reduceMotionQuery && reduceMotionQuery.matches);

  function initScrollProgress() {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var queued = false;
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      bar.style.transform = "scaleX(" + progress.toFixed(4) + ")";
      queued = false;
    };
    var queue = function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    update();
  }

  function initCursor() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;

    var ring = document.createElement("div");
    var dot = document.createElement("div");
    ring.className = "cursor-ring";
    dot.className = "cursor-dot";
    ring.setAttribute("aria-hidden", "true");
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.documentElement.classList.add("has-cursor");

    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var ringX = targetX;
    var ringY = targetY;
    var visible = false;

    var show = function () {
      if (visible) return;
      visible = true;
      ring.classList.add("is-visible");
      dot.classList.add("is-visible");
    };

    var hide = function () {
      visible = false;
      ring.classList.remove("is-visible");
      dot.classList.remove("is-visible");
    };

    var interactiveSelector = "a, button, .btn, input, select, textarea, label, .media-frame, .project-card, .team-card, .grid-cell, [data-cursor]";
    var darkSelector = ".site-footer, .section-dark, .cta-band, .page-hero-dark, .page-hero.has-media, .error-page.has-media";

    window.addEventListener("mousemove", function (event) {
      targetX = event.clientX;
      targetY = event.clientY;
      show();
      var node = event.target;
      var interactive = node && node.closest ? node.closest(interactiveSelector) : null;
      var dark = node && node.closest ? node.closest(darkSelector) : null;
      ring.classList.toggle("is-active", !!interactive);
      ring.classList.toggle("is-light", !!dark);
    }, { passive: true });

    window.addEventListener("mousedown", function () {
      ring.classList.add("is-down");
    });

    window.addEventListener("mouseup", function () {
      ring.classList.remove("is-down");
    });

    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    var render = function () {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      dot.style.transform = "translate3d(" + targetX + "px," + targetY + "px,0) translate(-50%,-50%)";
      ring.style.transform = "translate3d(" + ringX.toFixed(2) + "px," + ringY.toFixed(2) + "px,0) translate(-50%,-50%)";
      window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);
  }

  function splitHeadline(el) {
    var count = 0;
    var walk = function (node) {
      var kids = Array.prototype.slice.call(node.childNodes);
      for (var i = 0; i < kids.length; i++) {
        var kid = kids[i];
        if (kid.nodeType === 3) {
          var parts = kid.nodeValue.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          for (var j = 0; j < parts.length; j++) {
            var part = parts[j];
            if (!part) continue;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
              continue;
            }
            var word = document.createElement("span");
            word.className = "w";
            var inner = document.createElement("span");
            inner.className = "w-in";
            inner.style.setProperty("--d", count * 55 + "ms");
            inner.textContent = part;
            word.appendChild(inner);
            frag.appendChild(word);
            count += 1;
          }
          node.replaceChild(frag, kid);
        } else if (kid.nodeType === 1 && kid.tagName !== "BR") {
          walk(kid);
        }
      }
    };
    walk(el);
    return count;
  }

  function initHeadlines() {
    if (prefersReducedMotion) return;
    var titles = document.querySelectorAll(".hero-title, .page-title, .error-page .section-title");
    Array.prototype.forEach.call(titles, function (title) {
      if (title.getAttribute("data-split") === "done") return;
      if (!splitHeadline(title)) return;
      title.setAttribute("data-split", "done");
      title.classList.add("is-split");
      window.setTimeout(function () {
        var word = title.querySelector(".w-in");
        if (word && window.getComputedStyle(word).opacity !== "1") {
          title.classList.add("is-static");
        }
      }, 2800);
    });
  }

  initScrollProgress();
  initCursor();
  initHeadlines();

  var forms = document.querySelectorAll("[data-contact-form]");
  forms.forEach(function (form) {
    var status = form.querySelector("[data-form-status]");
    var submitButton = form.querySelector("[data-form-submit]");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var setStatus = function (message, state) {
      if (!status) return;
      status.textContent = message;
      status.classList.remove("is-pending", "is-error");
      if (state) status.classList.add(state);
      status.classList.add("is-visible");
    };

    var fieldWrap = function (field) {
      return field ? field.closest(".form-field") : null;
    };

    var validate = function () {
      var valid = true;
      var name = form.querySelector("[name='name']");
      var email = form.querySelector("[name='email']");
      var consent = form.querySelector("[name='consent']");

      [[name, function () { return name.value.trim().length > 1; }], [email, function () { return emailPattern.test(email.value.trim()); }], [consent, function () { return consent.checked; }]].forEach(function (pair) {
        var field = pair[0];
        var wrap = fieldWrap(field);
        var ok = pair[1]();
        if (!ok) valid = false;
        if (wrap) wrap.classList.toggle("is-invalid", !ok);
        if (field.setAttribute) field.setAttribute("aria-invalid", ok ? "false" : "true");
      });

      return valid;
    };

    var clearError = function (event) {
      var wrap = fieldWrap(event.target);
      if (wrap) wrap.classList.remove("is-invalid");
    };

    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("input", clearError);
      field.addEventListener("change", clearError);
    });


    var collect = function () {
      var data = {};
      new FormData(form).forEach(function (value, key) {
        data[key] = typeof value === "string" ? value.trim() : value;
      });
      return data;
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validate()) {
        setStatus("Please complete the required fields. Name, a valid email address and the consent checkbox are needed so we can reply.", "is-error");
        var firstInvalid = form.querySelector(".is-invalid input, .is-invalid select");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var honeypot = form.querySelector("[name='_gotcha']");
      if (honeypot && honeypot.value) {
        setStatus("Thank you. Your enquiry has been received.", null);
        form.reset();
        return;
      }

      var data = collect();
      var endpoint = (form.getAttribute("action") || "").trim();
      var localEndpoint = endpoint.indexOf("http://127.0.0.1") === 0 || endpoint.indexOf("http://localhost") === 0;
      var endpointReady =
        endpoint.indexOf("FORMSPREE_FORM_ID") === -1 &&
        endpoint.length > 8 &&
        (endpoint.indexOf("https://") === 0 || localEndpoint);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalLabel = submitButton.textContent;
        submitButton.textContent = "Sending...";
      }
      setStatus("Sending your enquiry...", "is-pending");

      var restoreButton = function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalLabel || "Send Enquiry";
        }
      };

      if (!endpointReady) {
        restoreButton();
        setStatus("The enquiry form is not connected yet. Please try again shortly.", "is-error");
        return;
      }

      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Request failed with status " + response.status);
          form.reset();
          restoreButton();
          setStatus("Thank you, " + (data.name || "there").split(" ")[0] + ". Your enquiry has reached our team. We respond within two working days.", null);
        })
        .catch(function () {
          restoreButton();
          setStatus("We could not send that just now. Please try again in a moment.", "is-error");
        });
    });
  });

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear().toString();
  });
})();
