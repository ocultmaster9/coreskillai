// AdSense responsive size constants — safe to import from both server + client components
export const AD_SIZES = {
  horizontal: [[728, 90], [468, 60], [320, 100]] as Array<[number, number]>,
  vertical: [[160, 600], [300, 600]] as Array<[number, number]>,
  rectangle: [[300, 250], [336, 280]] as Array<[number, number]>,
  auto: [[728, 90], [300, 250], [320, 100]] as Array<[number, number]>,
};
