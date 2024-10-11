import axios from 'axios';
import { Basic } from '../_type/type';

export const getBasic = async (ocid: string) => {
  try {
    const response = await axios.get(
      `api/getCharacterBasic?ocid=${encodeURIComponent(ocid)}`
    );

    const data: Basic = await response.data;

    return data;
  } catch (e) {
    throw e;
  }
};
