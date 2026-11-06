// Curated Pexels photography used across the platform
export const px = (id: number, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const pools = {
  necklace: [29038003, 28347073, 35059564, 31772511, 15622999, 37485315, 20768279, 36650259].map((i) => px(i)),
  pendant: [32780784, 20768279, 15622999, 36650259, 31496006, 7514840].map((i) => px(i)),
  ring: [2849742, 5737315, 12427696, 2732096, 7354015, 11745298, 31728371, 39229288].map((i) => px(i)),
  earring: [37601639, 37601638, 35137273, 13595577, 36841599, 2733490, 13786772, 34265174].map((i) => px(i)),
  bangle: [37485314, 37485315, 28347073, 35059564, 29038003].map((i) => px(i)),
  pearl: [30069309, 10889241, 6046165, 31496006, 7514840, 32039109, 10330851, 18285668].map((i) => px(i)),
  gem: [37955295, 3737445, 19985607, 15803904, 34703308, 4040567].map((i) => px(i)),
  bride: [28941551, 32501704, 9157350, 19869152, 36102603, 29370687, 20044503, 17001511].map((i) => px(i, 1000)),
  artisan: [31128289, 15955333, 15955332, 7167020, 38239304, 4354561].map((i) => px(i)),
};

export const pick = <T,>(arr: T[], i: number) => arr[((i % arr.length) + arr.length) % arr.length];

export const IMG = {
  hero: px(36102603, 2000),
  heroAlt: px(29370687, 1800),
  bridal: px(28941551, 1600),
  bridalB: px(17001511, 1200),
  bridalC: px(19869152, 1200),
  bridalD: px(32501704, 1200),
  gems: px(15803904, 1400),
  amethyst: px(34703308, 1400),
  set: px(35059564, 1400),
  craft: px(38239304, 1400),
  gold: px(37485315, 1400),
  ringHero: px(2849742, 1400),
  pearl: px(30069309, 1200),
  portrait: px(9157350, 1200),
  jhumka: px(37601639, 1200),
  stylist: px(18285668, 1200),
  rose: px(36650259, 1400),
};

export const VIDEO = {
  src: "https://videos.pexels.com/video-files/855854/855854-hd_1920_1080_24fps.mp4",
  poster: "https://images.pexels.com/videos/855854/free-video-855854.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
};
