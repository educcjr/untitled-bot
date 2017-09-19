/**
 * Simple parser for tokenizing strings.
 *
 * Sample:
 *
 * ```
 * const parser = Parser('10 myinput,');
 *
 * console.log(parser.nextInt());   // Prints 10
 * console.log(parser.nextIdent()); // Prints myinput
 * console.log(parser.next());      // Prints ','
 * ```
 *
 * If `.next` or `.peek` methods fail to parse, an error is thrown.
 */
class Parser {
  /**
   *
   * @param {String} input Input to be parsed.
   * @param {Boolean} autoskipWhitespace Whether to automatically skip whitespaces
   * when parsing input. Defaults to `true`.
   */
  constructor (input, autoskipWhitespace = true) {
    this.input = input;
    this.index = 0;
    this.autoskipWhitespace = autoskipWhitespace;
  }

  /**
   * Returns the current character without advancing the reading index.
   *
   * @returns {string} The current character in the input.
   * @throws If at end of input (i.e. `this.isEoF() == true`).
   */
  peek () {
    this.throwIfEoF();
    return this.input[this.index];
  }

  /**
   * Returns the current character, and advances the reading index to the next
   * character of the input.
   *
   * @returns {string} The current character in the input.
   * @throws If at end of input (i.e. `this.isEoF() == true`).
   */
  next () {
    this.throwIfEoF();
    return this.input[this.index++];
  }

  /**
   * @returns {number} The integer, parsed as a number.
   * @throws If at end of input (i.e. `this.isEoF() == true`).
   * @throws If the next char is not a digit.
   */
  nextInt () {
    if (this.autoskipWhitespace) {
      this.skipWhitespace();
    }

    if (!this.isDigit(this.peek())) {
      throw Error('Expected digit at index ', this.index);
    }

    var result = this.getStringAfterSkipping(() => {
      this.next(); // We already now this is a digit because of the `if` above

      while (!this.isEoF() && this.isDigit(this.peek())) {
        this.next();
      }
    });

    return Number.parseInt(result);
  }

  /**
   * @returns {number} The float, parsed as a number.
   * @throws If at end of input (i.e. `this.isEoF() == true`).
   * @throws If the next char is not a digit, or the regex fails the match /\d+(\.\d+)?/
   */
  nextFloat () {
    const match = this.nextRegex(/\d+(\.\d+)?/);

    return Number.parseFloat(match);
  }

  /**
   * Parses an identifier. An identifier is any collection of non-whitespace
   * characters, up until the first whitespace char.
   * @returns {string} Parsed string up until first whitespace.
   * @throws If at end of input (i.e. `this.isEoF() == true`).
   */
  nextIdent () {
    if (this.autoskipWhitespace) {
      this.skipWhitespace();
    }

    this.throwIfEoF();

    return this.getStringAfterSkipping(() => {
      while (!this.isEoF() && !this.isWhitespace(this.peek())) {
        this.next();
      }
    });
  }

  /**
   * Verifies the next identifier passed a given checking closure.
   * The closure receives in the next identifier string and returns true/false,
   * and the method throws if the return is `false`, with a given error message.
   * @param {(String) => Boolean} matching
   * @param {string} errorMessage
   * @returns {String} The identifier that was matches
   */
  validateNextIdent (matching, errorMessage = null) {
    const ident = this.nextIdent();
    if (!matching(ident)) {
      throw Error(errorMessage);
    }

    return ident;
  }

  /**
   * Matches a given regex from the current point in the string.
   * If the regex doesn't match, or the first match is not exactly at index `this.index`,
   * an error is thrown.
   * @param {string} regex
   * @returns {RegExpExecArray} The resulting match array.
   */
  nextRegex (regex) {
    if (this.autoskipWhitespace) {
      this.skipWhitespace();
    }

    const matches = RegExp(regex).exec(this.input.substr(this.index));

    if (matches.length === 0 || matches.index !== 0) {
      throw Error('Failed to match ' + regex + ' against remaining input.');
    }

    this.index += matches[0].length;

    return matches;
  }

  /**
   * Collects all the remaining string from the current point in the input.
   * After this call, any further attempt to call a parsing method will result
   * in an EoF error.
   * @returns {String}
   */
  remaining () {
    const rem = this.input.substr(this.index);

    this.index = this.input.length;

    return rem;
  }

  /**
   * Skips all whitespace characters until a non-whitespace char is hit, or end-of-file
   * is reached.
   */
  skipWhitespace () {
    while (!this.isEoF() && this.isWhitespace(this.peek())) {
      this.next();
    }
  }

  /**
   * Returns whether char is a whitespace character.
   * Whitespace chars recognized: \s, \t, \r, \n.
   * @param {string} char
   */
  isWhitespace (char) {
    return char === ' ' || char === '\t' || char === '\r' || char === '\n';
  }

  /**
   * Returns whether char is one of the 10 numerical digits.
   * @param {string} char
   */
  isDigit (char) {
    const code = char.charCodeAt(0);
    return code >= 48 /* = '0' */ && code <= 57;
  }

  /**
   * Returns whether char is one of the 26 alphabetical letters, lowercase and
   * uppercase.
   * @param {string} char
   */
  isLetter (char) {
    const code = char.charCodeAt(0);
    return (code >= 97 /* = 'a' */ && code <= 122 /* = 'z' */) ||
      (code >= 65 /* = 'A' */ && code <= 90 /* = 'Z' */);
  }

  /**
   * Returns whether char is either a letter or a digit.
   * @param {string} char
   */
  isAlpha (char) {
    return this.isLetter(char) || this.isDigit(char);
  }

  /**
   * Whether the index to read points to the end of the string, that is, no more
   * string can be parsed.
   *
   * `EoF` comes from 'end-of-file' and is the common term used in programming
   * when a reading index points to the end of the readable region.
   *
   * @returns {bool} Returns if `this.index >= this.input.length`. Used to check
   * if the parser is at the end of the input.
   */
  isEoF () {
    return this.index >= this.input.length;
  }

  /**
   * Helper method for checking end of input and throwing automatically.
   *
   * @throws If `this.isEoF() == true`.
   */
  throwIfEoF () {
    if (this.isEoF()) {
      throw Error('Unexpected end of input.');
    }
  }

  /**
   * Used to return a string that starts at the current index, and ends at the
   * index after the closure finishes executing. Used to aid in collecting strings
   * without having to deal w/ locals.
   * @param {() => void} closure
   */
  getStringAfterSkipping (closure) {
    const startIndex = this.index;
    closure();

    return this.input.substring(startIndex, this.index);
  }
}

module.exports = Parser;
