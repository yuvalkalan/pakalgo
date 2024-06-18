export interface SpeedDialButton {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
  disable: boolean;
}

export interface Net {
  id: number;
  group: string;
  name: string;
  encryption: boolean;
  ok: string;
  frequency: number;
  hasChanged: boolean;
}

export interface Mark {
  id: number;
  name: string;
  color: string;
}

export interface Site {
  id: number;
  name: string;
}

export interface SiteViewEntry {
  siteId: number;
  name: string;
  netId: number | null;
  markId: number | null;
  notes: string;
  hasChanged: boolean;
  canEdit: boolean;
}

export interface SiteEntryRow {
  siteName: string;
  name: string;
  netName: string;
  netGroup: string;
  netEncryption: string;
  netOk: string;
  frequency: number;
  unitNotes: string;
}

export interface Pakal {
  entries: SiteViewEntry[];
  sites: Site[];
  marks: Mark[];
  nets: Net[];
}

export interface SiteDialogEntry {
  checked: boolean;
  site: Site;
  units: string[];
}

export interface MarkDialogEntry {
  id: number;
  color: string;
  name: string;
  checked: boolean;
}

export interface NetDialogEntry {
  id: number;
  group: string;
  name: string;
  encryption: boolean;
  ok: string;
  frequency: number;
  hasChanged: boolean;
  checked: boolean;
  isNew: boolean;
}

export interface NetViewCell {
  value: string;
  markId: number | null;
  hasChanged: boolean;
}

export interface NetViewEntry {
  net: Net;
  cells: NetViewCell[];
}

export interface SnackbarItem {
  text: string;
  severity: "error" | "info" | "success" | "warning";
}

export interface PakalError {
  error: string;
  value: string;
}
