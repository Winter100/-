'use client';

import { useEffect, useRef, useState } from 'react';

import { getAllUser, removeUser } from './utils/localStorage';
import { getUserData } from './get/getAllUser';
import { Basic } from './_type/type';
import { convertToKoreanTime } from './utils/convertToKoreanTime';
import { daysSinceLastLogin } from './utils/daysSinceLastLogin';
import { transformData } from './utils/transformData';

export default function Home() {
  const [user, setUser] = useState<{ basic: Basic }[]>([]);
  const [isRefresh, setIsRefresh] = useState('');
  const [sortOrder, setSortOrder] = useState({ field: '', order: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const Search = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchLoading(true);
    try {
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
    } catch (e) {
      console.log(e);
    } finally {
      setSearchLoading(false);
    }
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
    setIsLoading(true);
    const allUser = getAllUser();
    const userNameList = allUser.map((item) => item.basic.character_name);

    try {
      for (let i = 0; i < userNameList.length; i++) {
        await getUserData(userNameList[i]);
      }
    } catch (e) {
      setIsRefresh('갱신 실패');
    } finally {
      setIsLoading(false);
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
        compareA =
          field === 'login'
            ? new Date(a.basic.character_date_last_login).getTime()
            : new Date(a.basic.character_date_last_logout).getTime();
        compareB =
          field === 'login'
            ? new Date(b.basic.character_date_last_login).getTime()
            : new Date(b.basic.character_date_last_logout).getTime();
      } else {
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

  console.log(transformData(user));

  const newUser = transformData(user);

  return (
    <main className='flex min-h-screen h-full items-center flex-col p-4'>
      <h1 className='text-lg'>둥글둥글 엿보기 구멍</h1>
      <form className='my-2 flex' onSubmit={(e) => Search(e)}>
        <input ref={inputRef} />
        <>
          {!searchLoading ? (
            <button className='ml-2' type='submit'>
              검색
            </button>
          ) : (
            <div
              role='status'
              className='w-full flex items-center justify-center'
            >
              <svg
                aria-hidden='true'
                className='w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
            </div>
          )}
        </>
      </form>
      <div className='w-full h-full  rounded-lg max-w-screen-lg flex items-center justify-center'>
        <div className='flex h-full w-full flex-col'>
          <div className='flex text-sm flex-row h-10 my-2 border-b border-black  items-center justify-items-center w-full'>
            <p
              className='w-52 text-center cursor-pointer flex items-start justify-center'
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
              {!isLoading ? (
                <>
                  <p className='text-center w-full'>새로고침</p>
                  <p className='text-center w-full text-xs'>
                    {isRefresh} {isRefresh && '갱신'}
                  </p>
                </>
              ) : (
                <div
                  role='status'
                  className='w-full flex items-center justify-center'
                >
                  <svg
                    aria-hidden='true'
                    className='w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                  <span className='sr-only'>Loading...</span>
                </div>
              )}
            </button>
          </div>
          <div className='items-center h-full justify-items-center w-full'>
            <ul className='w-full flex flex-col h-full pb-2'>
              {newUser.map((item) => (
                <li
                  key={item.cairde_name}
                  className='flex py-2 items-center justify-center border-b border-zinc-600 w-full'
                >
                  <div className='flex w-52 items-center justify-center '>
                    {item.cairde_name}
                  </div>
                  <ul className='flex-1 gap-2 flex flex-col '>
                    {item.value.map((character) => (
                      <li
                        className='grid w-full items-center grid-cols-5 justify-items-center'
                        key={character.character_name}
                      >
                        <div>{character.character_name}</div>
                        <div>
                          {convertToKoreanTime(
                            character.character_date_last_login
                          )}
                        </div>
                        <div>
                          {convertToKoreanTime(
                            character.character_date_last_logout
                          )}
                        </div>
                        <div>
                          {`${
                            daysSinceLastLogin(
                              character.character_date_last_login,
                              character.character_date_last_logout
                            ) >= 1
                              ? `${daysSinceLastLogin(
                                  character.character_date_last_login,
                                  character.character_date_last_logout
                                )}일 미접속`
                              : '-'
                          }`}
                        </div>
                        <div>
                          <button
                            onClick={() => onClick(character.character_name)}
                            className='flex-1 text-center'
                          >
                            삭제
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
