const VIDEO_TYPES = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  ogv: 'video/ogg',
};

/**
 * Builds a full-bleed, autoplaying background video from a link to a video file.
 * @param {HTMLAnchorElement} link Anchor pointing at the video file
 * @param {HTMLImageElement} [poster] Optional poster image shown before/while loading
 * @returns {HTMLVideoElement}
 */
function buildBackgroundVideo(link, poster) {
  const video = document.createElement('video');
  // Attributes required for silent autoplay across browsers.
  ['autoplay', 'loop', 'muted', 'playsinline'].forEach((attr) => video.setAttribute(attr, ''));
  video.muted = true; // property form is required for autoplay in Safari/Chrome
  video.setAttribute('aria-hidden', 'true');
  if (poster) video.poster = poster.currentSrc || poster.src;

  const href = link.getAttribute('href');
  const ext = href.split('.').pop().split(/[?#]/)[0].toLowerCase();
  const source = document.createElement('source');
  source.src = href;
  source.type = VIDEO_TYPES[ext] || `video/${ext}`;
  video.append(source);

  return video;
}

/**
 * loads and decorates the hero-banner block
 *
 * This hero is a full-bleed background video only — the source Figma frame
 * contains just the video (any text/CTA layers in the file are hidden and
 * intentionally not rendered).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const videoLink = block.querySelector(
    'a[href$=".mp4"], a[href$=".webm"], a[href$=".mov"], a[href$=".ogv"]',
  );

  if (videoLink) {
    const poster = block.querySelector('picture img');
    const video = buildBackgroundVideo(videoLink, poster);

    // Remove the authored link (and any poster picture) from the content flow...
    (videoLink.closest('p') || videoLink).remove();
    const picture = block.querySelector('picture');
    if (picture) (picture.closest('p') || picture).remove();

    // ...add the video as the first direct child so it fills the block.
    block.prepend(video);

    // Drop the now-empty authored row/cell wrappers left behind.
    block.querySelectorAll(':scope > div').forEach((row) => {
      if (!row.textContent.trim() && !row.querySelector('img, picture, video, a, button')) {
        row.remove();
      }
    });

    block.classList.add('has-video');
  }
}
