/** Shared only by the persistent Projects layout and its CRT. */
export const projectNavigation = Symbol('project-navigation');
export type ProjectNavigation = { readonly moving: boolean };
