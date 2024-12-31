import { FieldErrors, FieldValues } from "react-hook-form";
import { toast } from "react-toastify";

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

const generatePDF = async (path: string) => {
  try {
    // Fetch the PDF from the server

    const response = await fetch("/api/getpdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: path }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    const blob = await response.blob();

    // Create a link element for the download
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "output.pdf";

    // Programmatically click the link to trigger the download
    link.click();
  } catch (error) {
    toast.error("Unable to download pdf try again.");
  }
};

export { generatePDF };
