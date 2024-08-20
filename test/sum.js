export const kali = (a, b) => {
  return a * b;
};

export const sayHello = (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name) resolve(`hello ${name}`);
      else reject("nama kosong");
    }, 1000);
  });
};
