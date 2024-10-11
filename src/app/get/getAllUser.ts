import { getBasic } from '../_services/getBasic';
import { getOcid } from '../_services/getOcid';
import { setUser } from '../utils/localStorage';

export const getUserData = async (name: string) => {
  const ocid = await getOcid(name);

  try {
    const [basic] = await Promise.all([getBasic(ocid)]);

    const user = {
      basic,
    };

    if (basic) {
      setUser(user);
    }
  } catch (e) {
    console.log(e);
  }
};
