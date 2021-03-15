export interface GetTextIndicesSearchResult {
  start: number;
  end: number;
}
export interface GetTextIndicesOptions {
  caseSensitive?: boolean;
  multiple?: boolean;
}

const defaultOptions: GetTextIndicesOptions = {
  caseSensitive: true,
  multiple: false,
};

function stringEquals(
  str1: string,
  str2: string,
  caseSensitive: boolean
): boolean {
  return (
    (caseSensitive ? str1 : str1.toLowerCase()) ===
    (caseSensitive ? str2 : str2.toLowerCase())
  );
}

/**
 * Finds the indices of the 'searchText' in the 'fullStr'
 * @param {string} fullStr The string to search on
 * @param {string} searchText The string to find indices in the 'fullStr'
 * @param {boolean} multiple If this is set to true then the function will return an array of matches
 * @param {GetTextIndicesOptions} options The options
 */
export function getTextIndices(
  fullStr: string,
  searchText: string,
  options: GetTextIndicesOptions = defaultOptions
): GetTextIndicesSearchResult[] {
  const { caseSensitive, multiple } = {
    ...defaultOptions,
    ...options,
  } as Required<GetTextIndicesOptions>;

  if (typeof fullStr !== 'string') throw new Error(`'fullStr' must be string`);
  else if (typeof searchText !== 'string')
    throw new Error(`'searchText' must be a string`);
  else if (typeof multiple !== 'boolean')
    throw new Error(`'multiple' must be a boolean`);

  const regex = new RegExp(searchText, `g${caseSensitive ? '' : 'i'}`);
  const searchResults = [...fullStr.matchAll(regex)];
  const results: GetTextIndicesSearchResult[] = [];
  if (!searchResults) return results;
  searchResults.forEach((result) => {
    const { index: startIndex } = result;
    if (typeof startIndex !== 'number') return;
    let foundedText = '';
    for (let i = startIndex; i < fullStr.length; i++) {
      foundedText += fullStr[i];
      if (stringEquals(foundedText, searchText, caseSensitive))
        results.push({ start: startIndex, end: i });
    }
  });
  return results;
}
