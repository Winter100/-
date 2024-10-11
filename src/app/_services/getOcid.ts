import axios from 'axios';
import { getOcidItem, setOcidItem } from '../utils/localStorage';

export const getOcid = async (characterName: string): Promise<string> => {
  try {
    let ocid = getOcidItem(characterName);

    if (!ocid) {
      const response = await axios.get(
        `api/getCharacterOcid?character_name=${encodeURIComponent(
          characterName
        )}`
      );

      const data: { ocid: string } = response.data;
      setOcidItem(characterName, data.ocid) ?? '';
      ocid = data.ocid;
    }

    return ocid;
  } catch (e) {
    throw e;
  }
};
