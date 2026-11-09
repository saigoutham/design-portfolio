// Shared, mutable state. GSAP writes it (scroll and stillness tweens);
// the scene reads it every frame. Nothing here causes a React render.
export const stage = {
  t: 0, // time of day, 0 = first light, 1 = low sun
  iris: 0, // lens refocus, 0 to 1
  trickle: 0, // snow sliding off the shoulder, 0 to 1
  breath: 0, // chest rise, 0 to 1
  plumeRise: 0,
  plumeAlpha: 0,
  reduced: false,
};
