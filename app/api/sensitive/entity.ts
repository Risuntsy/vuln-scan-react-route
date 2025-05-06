export interface SensitiveData {
  id: string;
  name: string;
  regular: string;
  color: string;
  state: boolean;
}

export interface SensitiveAddData {
  name: string;
  regular: string;
  color: string;
  state: boolean;
}

export interface SensitiveUpdateData extends SensitiveAddData {
  id: string;
}

export interface SensitiveStateData {
  ids: string[];
  state: boolean;
}
