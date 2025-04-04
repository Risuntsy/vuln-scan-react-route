export interface PocData {
  id: string;
  name: string;
  level: string;
  content: string;
  time: string;
  tags: string[];
}

export interface PocContent {
  content: string;
}

export interface PocNameList {
  id: string;
  name: string;
}

export interface PocAddData {
  name: string;
  content: string;
  level: string;
  tags: string[];
}

export interface PocUpdateData extends PocAddData {
  id: string;
}
