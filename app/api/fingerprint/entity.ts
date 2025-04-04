export interface FingerprintData {
  id: string;
  name: string;
  rule: string;
  category: string;
  parent_category: string;
  state: boolean;
}

export interface FingerprintAddData {
  name: string;
  rule: string;
  category: string;
  parent_category: string;
  state: boolean;
}

export interface FingerprintUpdateData extends FingerprintAddData {
  id: string;
}
