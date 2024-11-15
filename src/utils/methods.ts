import { FieldErrors, FieldValues } from "react-hook-form";

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

const removeDuplicates = (arr: any[]): any[] => {
  return Array.from(new Set(arr));
};
export { formateDate, removeDuplicates };

const onFormError = <T extends FieldValues>(error: FieldErrors<T>) => {
  const firstErrorMessage = Object.values(error)[0]?.message;

  setTimeout(() => {
    if (firstErrorMessage) {
      const errorElement = Array.from(document.querySelectorAll("p")).find(
        (el) => el.textContent == firstErrorMessage
      );
      if (errorElement) {
        // Scroll to the error message element
        errorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start",
        });
      }
    }
  }, 1000);
};

export { onFormError };
