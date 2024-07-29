const errorToString = (e: unknown): string => {
  let err: string = "";
  if (typeof e === "string") {
    err = e.toUpperCase();
  } else if (e instanceof Error) {
    err = e.message;
  }
  return err;
};

export { errorToString };

const isContainSpace = (value: string): boolean => {
  return !value.includes(" ");
};

export { isContainSpace };

const capitalcase = (value: string): string => {
  const words = value.split(" ");

  const capitalWords = words.map((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  return capitalWords.join(" ");
};

export { capitalcase };

const onlyNumbersRegex = /^[0-9]*$/;

const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  if (!onlyNumbersRegex.test(value)) {
    event.target.value = event.target.value.slice(0, -1);
  }
};

export { handleNumberChange };

const formateDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month < 10 && day < 10) {
    return `0${day}-0${month}-${year}`;
  } else if (month < 10) {
    return `${day}-0${month}-${year}`;
  } else if (day < 10) {
    return `0${day}-${month}-${year}`;
  } else {
    return `${day}-${month}-${year}`;
  }
};
export { formateDate };
