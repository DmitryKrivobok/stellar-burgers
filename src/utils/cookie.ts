export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {}
) {
  props = {
    path: '/',
    ...props
  };

  let exp = props.expires;
  if (exp && typeof exp === 'number') {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }

  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, '', { expires: -1 });
}

export const storeTokens = (refreshToken: string, accessToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
};

export const resetTokens = () => {
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};

// Функции управления токенами (accessToken в Cookie, refreshToken в localStorage)

export const tokenStorage = {
  // Сохраняем accessToken в cookie
  saveAccessToken: (token: string): void => {
    setCookie('accessToken', token, { expires: 3600 }); // например, на 1 час
  },

  // Получаем accessToken из cookie
  getAccessToken: (): string | undefined => {
    return getCookie('accessToken');
  },

  // Удаляем accessToken из cookie
  deleteAccessToken: (): void => {
    setCookie('accessToken', '', { expires: -1 });
  },

  // Сохраняем refreshToken в localStorage
  saveRefreshToken: (token: string): void => {
    localStorage.setItem('refreshToken', token);
  },

  // Получаем refreshToken из localStorage
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  // Удаляем refreshToken из localStorage
  deleteRefreshToken: (): void => {
    localStorage.removeItem('refreshToken');
  },

  // Обновление всех токенов (например, при logout)
  clearTokens: (): void => {
    tokenStorage.deleteAccessToken();
    tokenStorage.deleteRefreshToken();
  }
};
