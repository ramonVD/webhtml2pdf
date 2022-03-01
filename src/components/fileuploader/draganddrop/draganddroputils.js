export const fileValidator = (files, config) => {
    const { allowedFileFormats, fileSizeMBLimit, filesLimit } = config;
    const { length } = files;
    const { size, type } = files[0];
    let err = false;
    let result = {
      isValidFile: false,
      errVal: err
    };
    if (length === 0) {
      return result;
    } else if (length > filesLimit) {
      err =
        filesLimit > 1
          ? `Només pots pujar ${filesLimit} arxius cada cop`
          : `Només pots pujar un arxiu cada cop`;
    } else if (!allowedFileFormats.includes(type)) {
      err = "El format de l'arxiu ha de ser html";
    } else if (size / 1024 / 1024 > fileSizeMBLimit) {
      err = `L'arxiu pesa més de ${fileSizeMBLimit}MB`;
    } else {
      result.isValidFile = true;
    }
    result.errVal = err;
    return result;
  };
  
  export const preventBrowserDefaults = e => {
    e.preventDefault();
    e.stopPropagation();
  };