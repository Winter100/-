export interface Basic {
  character_name: string;
  character_date_last_login: string;
  character_date_last_logout: string;
  cairde_name: string;
}

export type User = {
  basic: Basic;
};
