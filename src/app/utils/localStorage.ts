import { User } from '../_type/type';

export const getOcidItem = (name: string): string | null => {
  if (typeof window !== 'undefined') {
    const existingData = localStorage.getItem('ocidD');

    if (existingData) {
      const users = JSON.parse(existingData);

      const foundUser = users.find(
        (user: { name: string; ocid: string }) => user.name === name
      );

      if (foundUser) {
        return foundUser.ocid;
      } else {
        return null;
      }
    }
  }

  return null;
};

export const setOcidItem = (name: string, ocid: string) => {
  if (typeof window !== 'undefined') {
    const existingData = localStorage.getItem('ocidD');
    let users = [];

    if (existingData) {
      users = JSON.parse(existingData);
    }

    const newUser = {
      name,
      ocid,
    };

    users.push(newUser);

    localStorage.setItem('ocidD', JSON.stringify(users));
  }
};

export const setUser = (user: User) => {
  if (typeof window !== 'undefined') {
    const existingData = localStorage.getItem('user');
    let users: User[] = [];

    if (existingData) {
      users = JSON.parse(existingData);
    }

    const index = users.findIndex(
      (existingUser) =>
        existingUser.basic.character_name === user.basic.character_name
    );

    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }

    localStorage.setItem('user', JSON.stringify(users));
  }
};

export const removeUser = (name: string) => {
  if (typeof window !== 'undefined') {
    const existingData = localStorage.getItem('user');
    let users: User[] = [];

    if (existingData) {
      users = JSON.parse(existingData);
    }

    users = users.filter(
      (existingUser) => existingUser.basic.character_name !== name
    );

    localStorage.setItem('user', JSON.stringify(users));
  }
};

export const getUser = (user: User) => {
  if (typeof window !== 'undefined') {
    const existingData = localStorage.getItem('user');

    if (existingData) {
      const users = JSON.parse(existingData);

      const foundUser = users.find(
        (u: { name: string }) => u.name === user.basic.character_name
      );

      if (foundUser) {
        return foundUser;
      }
    }
  }

  return null;
};
export const getAllUser = (): User[] => {
  if (typeof window !== 'undefined') {
    const existingData = localStorage.getItem('user');

    if (existingData) {
      const users = JSON.parse(existingData);
      return users;
    } else {
      return [];
    }
  }
  return [];
};
