interface CharacterInfo {
  character_name: string;
  character_date_last_login: string;
  character_date_last_logout: string;
}

interface CairdeGroup {
  cairde_name: string;
  value: CharacterInfo[];
}

interface BasicInfo {
  character_name: string;
  character_date_last_login: string;
  character_date_last_logout: string;
  cairde_name: string;
}

interface OriginalData {
  basic: BasicInfo;
}

export function transformData(data: OriginalData[]): CairdeGroup[] {
  return data.reduce<CairdeGroup[]>((acc, { basic }) => {
    const {
      cairde_name,
      character_name,
      character_date_last_login,
      character_date_last_logout,
    } = basic;

    let group = acc.find((group) => group.cairde_name === cairde_name);

    if (!group) {
      group = {
        cairde_name,
        value: [],
      };
      acc.push(group);
    }

    group.value.push({
      character_name,
      character_date_last_login,
      character_date_last_logout,
    });

    return acc;
  }, []);
}
