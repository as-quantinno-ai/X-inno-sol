import { pyServiceIp, pyServicePort } from "./default";

export const baseUrl = `ws://${pyServiceIp}:${pyServicePort}/ws`;

export function getFilterData(viewName) {
    return `${baseUrl}/filter_data/${viewName}/`;
}
