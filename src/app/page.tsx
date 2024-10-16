'use client';

import { useEffect, useRef, useState } from 'react';

import { getAllUser, removeUser } from './utils/localStorage';
import { getUserData } from './get/getAllUser';
import { Basic } from './_type/type';
import { convertToKoreanTime } from './utils/convertToKoreanTime';
import { daysSinceLastLogin } from './utils/daysSinceLastLogin';

export default function Home() {
  const [user, setUser] = useState<{ basic: Basic }[]>([]);
  const [isRefresh, setIsRefresh] = useState('');
  const [sortOrder, setSortOrder] = useState({ field: '', order: 'asc' });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const Search = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      if (inputRef.current.value) {
        const nameList = inputRef.current.value.split(' ');
        for (let i = 0; i < nameList.length; i++) {
          await getUserData(nameList[i]);
        }
        inputRef.current.value = '';
      }
    }
    const users = getAllUser();
    setUser(users);
  };

  useEffect(() => {
    const users = getAllUser();
    setUser(users);
  }, []);

  const onClick = (name: string) => {
    removeUser(name);
    setUser(getAllUser());
  };

  const refresh = async () => {
    const allUser = getAllUser();
    const userNameList = allUser.map((item) => item.basic.character_name);

    try {
      for (let i = 0; i < userNameList.length; i++) {
        await getUserData(userNameList[i]);
      }
    } catch (e) {
      setIsRefresh('갱신 실패');
    }

    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Seoul',
    };
    const time = date.toLocaleTimeString('ko-KR', options);
    setIsRefresh(time);
    setUser(getAllUser());
  };

  const handleSort = (
    field: 'cairde_name' | 'character_name' | 'login' | 'logout'
  ) => {
    const isAscending = sortOrder.field === field && sortOrder.order === 'asc';
    const sortedUsers = [...user].sort((a, b) => {
      let compareA, compareB;

      if (field === 'login' || field === 'logout') {
        // Date fields
        compareA =
          field === 'login'
            ? new Date(a.basic.character_date_last_login).getTime()
            : new Date(a.basic.character_date_last_logout).getTime();
        compareB =
          field === 'login'
            ? new Date(b.basic.character_date_last_login).getTime()
            : new Date(b.basic.character_date_last_logout).getTime();
      } else {
        // String fields (Cairde name, Character name)
        compareA = a?.basic[field]?.toLowerCase();
        compareB = b?.basic[field]?.toLowerCase();
      }

      if (compareA < compareB) return isAscending ? -1 : 1;
      if (compareA > compareB) return isAscending ? 1 : -1;
      return 0;
    });

    setUser(sortedUsers);
    setSortOrder({
      field,
      order: isAscending ? 'desc' : 'asc',
    });
  };

  return (
    <main className='flex min-h-screen h-full items-center flex-col p-24'>
      <h1 className='text-lg'>둥글둥글 엿보기 구멍</h1>
      <form className='my-2' onSubmit={(e) => Search(e)}>
        <input ref={inputRef} />
        <button className='ml-2' type='submit'>
          검색
        </button>
      </form>
      <div className='w-full h-full border border-black rounded-lg max-w-screen-lg flex items-center justify-center'>
        <div className='flex h-full w-full flex-col'>
          <div className='flex text-sm flex-row h-10 my-2 border-b border-black  items-center justify-items-center w-full'>
            <p
              className='flex-1 text-center cursor-pointer flex items-start justify-center'
              onClick={() => handleSort('cairde_name')}
            >
              카르제
              {sortOrder.field === 'cairde_name' &&
                (sortOrder.order === 'asc' ? '▲' : '▼')}
            </p>
            <p
              className='flex-1 text-center cursor-pointer flex items-start justify-center'
              onClick={() => handleSort('character_name')}
            >
              이름
              {sortOrder.field === 'character_name' &&
                (sortOrder.order === 'asc' ? '▲' : '▼')}
            </p>
            <p
              className='flex-1 text-center cursor-pointer flex items-start justify-center'
              onClick={() => handleSort('login')}
            >
              접속일
              {sortOrder.field === 'login' &&
                (sortOrder.order === 'asc' ? '▲' : '▼')}
            </p>
            <p
              className='flex-1 text-center cursor-pointer flex items-start justify-center'
              onClick={() => handleSort('logout')}
            >
              종료일
              {sortOrder.field === 'logout' &&
                (sortOrder.order === 'asc' ? '▲' : '▼')}
            </p>
            <p className='flex-1 text-center'>미접속</p>
            <button
              onClick={refresh}
              className='flex-1 flex flex-col items-start justify-center text-center'
            >
              <p className='text-center w-full'>새로고침</p>
              <p className='text-center w-full text-xs'>
                {isRefresh} {isRefresh && '갱신'}
              </p>
            </button>
          </div>
          <div className='items-center h-full justify-items-center w-full'>
            <ul className='gap-2 flex flex-col h-full'>
              {user.map((item) => (
                <li
                  className='grid hover:text-blue-500 grid-cols-6 justify-items-center h-full'
                  key={item.basic.character_name}
                >
                  <p className='flex-1 text-center'>{item.basic.cairde_name}</p>
                  <p className='flex-1 text-center'>
                    {item.basic.character_name}
                  </p>
                  <p className='flex-1 text-center'>
                    {convertToKoreanTime(item.basic.character_date_last_login)}
                  </p>
                  <p className='flex-1 text-center'>
                    {convertToKoreanTime(item.basic.character_date_last_logout)}
                  </p>
                  <p>
                    {`${
                      daysSinceLastLogin(
                        item.basic.character_date_last_login,
                        item.basic.character_date_last_logout
                      ) >= 1
                        ? `${daysSinceLastLogin(
                            item.basic.character_date_last_login,
                            item.basic.character_date_last_logout
                          )}일 미접속`
                        : '-'
                    }`}
                  </p>
                  <button
                    onClick={() => onClick(item.basic.character_name)}
                    className='flex-1 text-center'
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
