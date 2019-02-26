
const encodingChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const btoaSupport = (typeof btoa !== "undefined");

/**
 * Converts byte data to Base64 string
 *
 * @export toBase64
 * @param {array} data An array of bytes values (numbers from 0-255)
 * @param {boolean} [base64Url=false] Converts to a Base64Url string if True (default = false)
 * @returns {string}
 */
export function toBase64(data, base64Url) {
  let output = "";

  if (!base64Url) {
    base64Url = false;
  }

  // If the input is an array type, convert it to a string.
  // The built-in btoa takes strings.
  if (data.pop || data.subarray) {
    data = String.fromCharCode.apply(null, data);
  }

  if (btoaSupport) {
    output = btoa(data);
  } else {
    let char1;
    let char2;
    let char3;
    let enc1;
    let enc2;
    let enc3;
    let enc4;
    let i;

    for (i = 0; i < data.length; i += 3) {
      // Get the next three chars.
      char1 = data.charCodeAt(i);
      char2 = data.charCodeAt(i + 1);
      char3 = data.charCodeAt(i + 2);

      // Encode three bytes over four 6-bit values.
      // [A7,A6,A5,A4,A3,A2,A1,A0][B7,B6,B5,B4,B3,B2,B1,B0][C7,C6,C5,C4,C3,C2,C1,C0].
      // [A7,A6,A5,A4,A3,A2][A1,A0,B7,B6,B5,B4][B3,B2,B1,B0,C7,C6][C5,C4,C3,C2,C1,C0].

      // 'enc1' = high 6-bits from char1
      enc1 = char1 >> 2;
      // 'enc2' = 2 low-bits of char1 + 4 high-bits of char2
      enc2 = ((char1 & 0x3) << 4) | (char2 >> 4);
      // 'enc3' = 4 low-bits of char2 + 2 high-bits of char3
      enc3 = ((char2 & 0xF) << 2) | (char3 >> 6);
      // 'enc4' = 6 low-bits of char3
      enc4 = char3 & 0x3F;

      // 'char2' could be 'nothing' if there is only one char left to encode
      //   if so, set enc3 & enc4 to 64 as padding.
      if (isNaN(char2)) {
        enc3 = enc4 = 64;

        // If there was only two chars to encode char3 will be 'nothing'
        //   set enc4 to 64 as padding.
      } else if (isNaN(char3)) {
        enc4 = 64;
      }

      // Lookup the base-64 value for each encoding.
      output = output +
        encodingChars.charAt(enc1) +
        encodingChars.charAt(enc2) +
        encodingChars.charAt(enc3) +
        encodingChars.charAt(enc4);
    }
  }

  if (base64Url) {
    return output.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
  }

  return output;
}

/**
 * Converts a Base64/Base64Url string to a text
 *
 * @export base64ToString
 * @param {string} encodedString A Base64/Base64Url encoded string
 * @returns {string}
 */
export function base64ToString(encodedString) {
  if (btoaSupport) {
    // This could be encoded as base64url (different from base64)
    encodedString = encodedString.replace(/-/g, "+").replace(/_/g, "/");

    // In case the padding is missing, add some.
    while (encodedString.length % 4 !== 0) {
      encodedString += "=";
    }

    return atob(encodedString);
  }

  return String.fromCharCode.apply(null, base64ToBytes(encodedString));
}

/**
 * Converts a Base64/Base64Url string to an Array
 *
 * @export encodedString
 * @param {string} encodedString A Base64/Base64Url encoded string
 * @returns {array}
 */
export function base64ToBytes(encodedString) {
  // This could be encoded as base64url (different from base64)
  encodedString = encodedString.replace(/-/g, "+").replace(/_/g, "/");

  // In case the padding is missing, add some.
  while (encodedString.length % 4 !== 0) {
    encodedString += "=";
  }

  const output = [];
  let char1;
  let char2;
  let char3;
  let enc1;
  let enc2;
  let enc3;
  let enc4;
  let i;

  // Remove any chars not in the base-64 space.
  encodedString = encodedString.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  for (i = 0; i < encodedString.length; i += 4) {
    // Get 4 characters from the encoded string.
    enc1 = encodingChars.indexOf(encodedString.charAt(i));
    enc2 = encodingChars.indexOf(encodedString.charAt(i + 1));
    enc3 = encodingChars.indexOf(encodedString.charAt(i + 2));
    enc4 = encodingChars.indexOf(encodedString.charAt(i + 3));

    // Convert four 6-bit values to three characters.
    // [A7,A6,A5,A4,A3,A2][A1,A0,B7,B6,B5,B4][B3,B2,B1,B0,C7,C6][C5,C4,C3,C2,C1,C0].
    // [A7,A6,A5,A4,A3,A2,A1,A0][B7,B6,B5,B4,B3,B2,B1,B0][C7,C6,C5,C4,C3,C2,C1,C0].

    // 'char1' = all 6 bits of enc1 + 2 high-bits of enc2.
    char1 = (enc1 << 2) | (enc2 >> 4);
    // 'char2' = 4 low-bits of enc2 + 4 high-bits of enc3.
    char2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    // 'char3' = 2 low-bits of enc3 + all 6 bits of enc4.
    char3 = ((enc3 & 3) << 6) | enc4;

    // Convert char1 to string character and append to output
    output.push(char1);

    // 'enc3' could be padding
    //   if so, 'char2' is ignored.
    if (enc3 !== 64) {
      output.push(char2);
    }

    // 'enc4' could be padding
    //   if so, 'char3' is ignored.
    if (enc4 !== 64) {
      output.push(char3);
    }
  }

  return output;
}

/**
 * Returns the name of an object type
 *
 * @export getObjectType
 * @param {object} object
 * @returns {string}
 */
export function getObjectType(object) {
  return Object.prototype.toString.call(object).slice(8, -1);
}

/**
 * Converts an Array of bytes values (0-255) to a Hex string
 *
 * @export bytesToHexString
 * @param {array} bytes
 * @param {boolean} [separate=true] Inserts a separator for display purposes
 * @returns {string}
 */
export function bytesToHexString(bytes, separate) {
  let result = "";
  if (typeof separate === "undefined") {
    separate = false;
  }

  for (let i = 0; i < bytes.length; i += 1) {
    if (separate && (i % 4 === 0) && i !== 0) {
      result += "-";
    }

    const hexVal = bytes[i].toString(16).toUpperCase();
    // Add a leading zero if needed.
    if (hexVal.length === 1) {
      result += "0";
    }

    result += hexVal;
  }

  return result;
}

/**
 * Converts four bytes to a 32-bit int
 *
 * @export bytesToInt32
 * @param bytes The bytes to convert
 * @param [index] Optional starting point
 * @returns {number} 32-bit number
 */
export function bytesToInt32(bytes, index) {
  index = (index || 0);

  return (bytes[index] << 24) |
    (bytes[index + 1] << 16) |
    (bytes[index + 2] << 8) |
    bytes[index + 3];
}


/**
 * Converts a String to an Array of byte values (0-255)
 *
 * @export stringToBytes
 * @param {string} messageString
 * @returns {array}
 */
export function stringToBytes(messageString) {
  const bytes = new Array(messageString.length);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = messageString.charCodeAt(i);
  }

  return bytes;
}

/**
 * Converts a Hex-String to an Array of byte values (0-255)
 *
 * @export hexToBytesArray
 * @param {string} hexString
 * @returns {array}
 */
export function hexToBytesArray(hexString) {
  hexString = hexString.replace(/\-/g, "");

  const result = [];
  while (hexString.length >= 2) {
    result.push(parseInt(hexString.substring(0, 2), 16));
    hexString = hexString.substring(2, hexString.length);
  }

  return result;
}


/**
 * Creates a shallow clone of an Object
 *
 * @export clone
 * @param {object} object
 * @returns {object}
 */
export function clone(object) {
  const newObject = {};
  for (const propertyName in object) {
    // eslint-disable-next-line
    if (object.hasOwnProperty(propertyName)) {
      newObject[propertyName] = object[propertyName];
    }
  }
  return newObject;
}


/**
 * Unpacks Base64 encoded data into arrays of data.
 *
 * @export unpackData
 * @param {string} base64String Base64 encoded data
 * @param {number} [arraySize] Break data into sub-arrays of a given length
 * @param {boolean} [toUint32s] Treat data as 32-bit data instead of byte data
 * @returns {array}
 */
export function unpackData(base64String, arraySize, toUint32s) {
  const bytes = base64ToBytes(base64String);
  const data = [];
  let i;

  if (isNaN(arraySize)) {
    return bytes;
  } else {
    for (i = 0; i < bytes.length; i += arraySize) {
      data.push(bytes.slice(i, i + arraySize));
    }
  }

  if (toUint32s) {
    for (i = 0; i < data.length; i += 1) {
      data[i] = (data[i][0] << 24) + (data[i][1] << 16) + (data[i][2] << 8) + data[i][3];
    }
  }

  return data;
}

/**
 * Converts a 32-bit number to an Array of 4 bytes
 *
 * @export int32ToBytes
 * @param {number} int32 32-bit number
 * @returns {array}
 */
export function int32ToBytes(int32) {
  return [(int32 >>> 24) & 255, (int32 >>> 16) & 255, (int32 >>> 8) & 255, int32 & 255];
}


/**
 * Converts an Array 32-bit numbers to an Array bytes
 *
 * @export int32ArrayToBytes
 * @param {array} int32Array Array of 32-bit numbers
 * @returns {array}
 */
export function int32ArrayToBytes(int32Array) {
  let result = [];
  for (let i = 0; i < int32Array.length; i += 1) {
    result = result.concat(int32ToBytes(int32Array[i]));
  }
  return result;
}

/**
 * Exclusive OR (XOR) two arrays.
 *
 * @export xorVectors
 * @param {array} a Input array.
 * @param {array} b Input array.
 * @returns {array} XOR of the two arrays. The length is minimum of the two input array lengths.
 */
export function xorVectors(a, b) {
  const length = Math.min(a.length, b.length);
  const res = new Array(length);
  for (let i = 0; i < length; i += 1) {
    res[i] = a[i] ^ b[i];
  }
  return res;
}

/**
 * Get an array filled with zeroes (or optional fillValue.)
 *
 * @export getVector
 * @param {number} length Requested array length.
 * @param {number} [fillValue]
 * @returns {array}
 */
export function getVector(length, fillValue) {
  // Use a default value of zero
  fillValue = fillValue || 0;

  const res = new Array(length);
  for (let i = 0; i < length; i += 1) {
    res[i] = fillValue;
  }
  return res;
}

/**
 * Converts a Uint8Array to a regular JavaScript Array
 *
 * @export toArray
 * @param {Uint8Array} typedArray
 * @returns {array}
 */
export function toArray(typedArray) {
  // If undefined or null return an empty array
  if (!typedArray) {
    return [];
  }

  // If already an Array return it
  if (typedArray.pop) {
    return typedArray;
  }

  // If it's an ArrayBuffer, convert it to a Uint8Array first
  if (typedArray.isView) {
    typedArray = Uint8Array(typedArray);
  }

  // A single element array will cause a new Array to be created with the length
  // equal to the value of the single element. Not what we want.
  // We'll return a new single element array with the single value.
  return (typedArray.length === 1) ? [typedArray[0]] : Array(...typedArray);
}

/**
 * Converts data to a Uint8Arry or a regular JavaScript Array
 *
 * @export toSupportedArray
 * @param {TypedArray|Array|ArrayBuffer|String} typedArray
 * @returns {array}
 */
export function toSupportedArray(data) {
  // does this browser support Typed Arrays?
  const typedArraySupport = (typeof Uint8Array !== "undefined");

  // get the data type of the parameter
  let dataType = Object.prototype.toString.call(data);
  dataType = dataType.substring(8, dataType.length - 1);

  // determine the type
  switch (dataType) {

    // Regular JavaScript Array. Convert to Uint8Array if supported
    // else do nothing and return the array
    case "Array":
      return typedArraySupport ? new Uint8Array(data) : data;

    // ArrayBuffer. IE11 Web Crypto API returns ArrayBuffers that you have to convert
    // to Typed Arrays. Convert to a Uint8Arrays and return;
    case "ArrayBuffer":
      return new Uint8Array(data);

    // Already Uint8Array. Obviously there is support.
    case "Uint8Array":
      return data;

    case "Uint16Array":
    case "Uint32Array":
      return new Uint8Array(data);
    // String.
    // Convert the string to a byte array using Typed Arrays if supported.
    case "String":
      return (() => {
        const newArray = typedArraySupport ? new Uint8Array(data.length) : new Array(data.length);
        for (let i = 0; i < data.length; i += 1) {
          newArray[i] = data.charCodeAt(i);
        }
        return newArray;
      })();
    // Some other type. Just return the data unchanged.
    default:
      throw new Error(`toSupportedArray : unsupported data type ${dataType}`);
  }
}

/**
 * Pads the end of an array with a specified value
 *
 * @export padEnd
 * @param {array} array
 * @param {number} value The value to pad to the array
 * @param {number} finalLength he final resulting length with padding
 * @returns {array}
 */
export function padEnd(array, value, finalLength) {
  while (array.length < finalLength) {
    array.push(value);
  }

  return array;
}

/**
 * Pads the front of an array with a specified value
 *
 * @export padFront
 * @param {array} array
 * @param {number} value The value to pad to the array
 * @param {number} finalLength The final resulting length with padding
 * @returns {array}
 */
export function padFront(array, value, finalLength) {
  while (array.length < finalLength) {
    array.unshift(value);
  }

  return array;
}

/**
 * Checks if two Arrays are equal by comparing their values.
 *
 * @export arraysEqual
 * @param {array} array1
 * @param {array} array2
 * @returns {array}
 */
export function arraysEqual(array1, array2) {
  let result = true;

  if (array1.length !== array2.length) {
    result = false;
  }

  for (let i = 0; i < array1.length; i += 1) {
    if (array1[i] !== array2[i]) {
      result = false;
    }
  }

  return result;
}

/**
 * Verify that an Array contains only byte values (0-255)
 *
 * @export verifyByteArray
 * @param {array} array
 * @returns {boolean} Returns true if all values are 0-255
 */
export function verifyByteArray(array) {
  if (getObjectType(array) !== "Array") {
    return false;
  }

  let element;

  for (let i = 0; i < array.length; i += 1) {
    element = array[i];

    if (isNaN(element) || element < 0 || element > 255) {
      return false;
    }
  }

  return true;
}
