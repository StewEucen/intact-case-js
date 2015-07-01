/**
 * Intact Case for Javascript : Interconverting camelCase and snake_case which include acronym.
 * Copyright (c) 2015 Stew Eucen (http://lab.kochlein.com)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author    StewEucen
 * @copyright Copyright (c) 2015 Stew Eucen (http://lab.kochlein.com)
 * @license   http://www.opensource.org/licenses/mit-license.php  MIT License
 * @link      http://lab.kochlein.com/IntactCase
 * @since     File available since Release 1.0.0
 * @version   1.0.0
 */
;~function(global) {
  "use strict";

  /**
   * Javascript statuses.
   *
   * @var {Boolean}
   */
  var isBrowser    = "document"       in global;
  var isWebWorkers = "WorkerLocation" in global;
  var isNodeJS     = "process"        in global;

  /**
   * Defined methods of Intact Case.
   *
   * @var {Object}
   */
  var methods = {
    /**
     * Convert to camelCase from delimiterized compound words.
     *
     * @author StewEucen
     * @method String.prototype.camelize
     * @param  {String} delimiter : Delimiter to separate $haystack.
     * @return {String} : camelCase String.
     * @since  Release 1.0.0
     */
    camelize: {
      type : String,
      alias: ["toCamelCase", "toNerdCaps"],
      body : function() {
        var f = function(all, br1, br2, br3, br4, br5, br6, br7) {
          return (br1 || br5 || "")
               + (((br2 || "") + (br3 || "") + (br4 || "")) || br6 || "").toUpperCase()
               + (br7 || "");
        };

        return function(delimiter) {
          delimiter = _complementDeilimiter(delimiter);
          var d = _escapeDelimiter(delimiter);

          var camelHeadAcronym = "^([a-z]+" + d + ")(?![a-z])";
          var acronymWord = "([a-z]+)" + d + "((?:" + d + "[a-z])*)(?![a-z])"
                          + "((?=" + d + "(?:[a-z]{2,}" + d + "|[a-z])(?![a-z]))" + d + ")?";
          var usualWord = "(?:^([a-z])|([a-z]))"
                        + "((?=" + d + "(?:[a-z]+" + d + "|[a-z])(?![a-z]))" + d + "|[a-z]*)";

          var p = camelHeadAcronym + "|" + acronymWord + "|" + usualWord + "|" + d;
          return this.replace(new RegExp(p, "g"), f);
        };
      }()
    },

    /**
     * Convert to StudlyCaps from delimiterized compound words.
     *
     * @author StewEucen
     * @method String.prototype.toStudlyCaps
     * @param  {String} delimiter : Delimiter to separate $haystack.
     * @return {String} : StudlyCaps String.
     * @since  Release 1.0.0
     */
    toStudlyCaps: {
      type : String,
      alias: ["toPascalCase"],
      body : function() {
        var f = function(all, br1, br2, br3, br4, br5) {
          return (((br1 || "") + (br2 || "") + (br3 || "")) || br4 || "").toUpperCase()
               + (br5 || "");
        };

        return function(delimiter) {
          delimiter = _complementDeilimiter(delimiter);
          var d = _escapeDelimiter(delimiter);

          var acronymWord = "([a-z]+)" + d + "((?:" + d + "[a-z])*)(?![a-z])"
                          + "((?=" + d + "(?:[a-z]{2,}" + d + "|[a-z])(?![a-z]))" + d + ")?";
          var usualWord = "([a-z])((?=" + d + "(?:[a-z]+" + d + "|[a-z])(?![a-z]))" + d + "|[a-z]*)";

          var p = acronymWord + "|" + usualWord + "|" + d;
          return this.replace(new RegExp(p, "g"), f);
        };
      }()
    },

    /**
     * Convert compound words connected by a delimiter from camelCase/StudlyCaps.
     *
     * @author StewEucen
     * @method String.prototype.delimiterize
     * @param  {String} delimiter      : Concatenate tokens by of $haystack with this.
     * @param  {String} asVendorPrefix : Treat as vendor-prefix (CSS).
     * @return {String} : Delimiterized string.
     * @since  Release 1.0.0
     */
    delimiterize: {
      type : String,
      alias: [
        "underscored",
        "toSnakeCase",
        "to_snake_case",
      ],
      body: function(delimiter, asVendorPrefix) {
        delimiter = _complementDeilimiter(delimiter);
        var d = _escapeDelimiter(delimiter);

        var p = "(?:^[a-z]{2,}" + d + "|[a-z])(?=[A-Z](?![a-z]))|[A-Z]{2,}(?![a-z])|(?!^)(?=[A-Z][a-z])";
          // (?:^[a-z]{2,}_|[a-z])(?=[A-Z](?![a-z])) : Before acronym|one-letter.
          // [A-Z]{2,}(?![a-z])                      : After acronym.
          // (?!^)(?=[A-Z][a-z])                     : Before capital.


        var head_delimiter = asVendorPrefix && this.match(/^[A-Z]/) ? delimiter : '';
        return head_delimiter + this.replace(new RegExp(p, "g"), "$&" + delimiter).toLowerCase();
      }
    },

    /**
     * Hyphenate compound words from camelCase/StudlyCaps.
     *
     * @author StewEucen
     * @method String.prototype.hyphenated
     * @param  {Boolean} asVendorPrefix : Treat as vendor-prefix (CSS).
     * @return {String} : Hyphenated string.
     * @since  Release 1.0.0
     */
    hyphenated: {
      type : String,
      alias: [
        "toTrainCase",
        "toChainCase",
        "toKebabCase",
        "toSpinalCase"
      ],
      body: function(asVendorPrefix) {
        return this.delimiterize("-", asVendorPrefix);
      }
    },

    /**
     * Explode to tokens from compound words (camelCase/StudlyCaps/delimiterized).
     *
     * @author StewEucen
     * @method String.prototype.tokenize
     * @param  {String}  delimiter  : Delimiter.
     * @param  {Boolean} rawFirstWord : Keep raw first word in tokens for camelCase.
     * @return {String} : Tokens except delimiter between acronym.
     * @since  Release 1.0.0
     */
    tokenize: {
      type : String,
      alias: [],
      body : function() {
        return function(delimiter, rawFirstWord) {
          delimiter = _complementDeilimiter(delimiter);
          var isCamel = this.match(/[A-Z]/);
          if (isCamel) {
            return _tokenizeFromCamelized(this, delimiter, rawFirstWord);
          } else {
            return _tokenizeFromDelimiterized(this, delimiter);
          }
        };

        /**
         * Tokenize from camelCase/StudlyCaps.
         */
        function _tokenizeFromCamelized(haystack, delimiter, rawFirstWord) {
          var d = _escapeDelimiter(delimiter);
          var p = "(?:[A-Z]+|[A-Z]?(?:[a-z]{2,}" + d + "?|[a-z]))(?![a-z])";
          var tokens = haystack.match(new RegExp(p, "g")) || [];  // [] for null

          // Upcase for acronym of first word in camelCase.
          if (!rawFirstWord) {
            var first = tokens[0];
            if (first && !first.match(/[A-Z]/)) {
              tokens[0] = first.toStudlyCaps(delimiter);
            }
          }

          return tokens;
        }

        /**
         * Tokenize from delimiterized string.
         */
        function _tokenizeFromDelimiterized(haystack, delimiter) {
          var d = _escapeDelimiter(delimiter);
          var p = "[a-z]+" + d + "?(?=" + d + "|$)";
          var tokens = haystack.match(new RegExp(p, "g")) || [];  // [] for null
          return tokens.filter(function(v) { return v; });
        }

      }()
    },

    /**
     * Concatenate tokens to create compound words.
     *
     * @author StewEucen
     * @method String.prototype.implode
     * @param  {Object} tokens  : Array of Tokens.
     * @param  {String} delimiter : Delimiter between acronym.
     * @return {String} : Compound words (camelCase/StudlyCaps/delimiterized).
     * @since  Release 1.0.0
     */
    compound: {
      type : Array,
      alias: [],
      body : function(delimiter) {
        delimiter = _complementDeilimiter(delimiter);
        var d = _escapeDelimiter(delimiter);
        var compounded = this.join(delimiter);
        var isCamel = compounded.match(/[A-Z]/);

        if (isCamel) {
          var p = "(.[a-z])" + d + "|([^_])" + d + "(?=[A-Z][a-z])";
          return compounded.replace(new RegExp(p, "g"), "$1$2");
        }

        return compounded;
      }
    },

    /**
     * Convert camelCasee to StudlyCaps.
     *
     * @author StewEucen
     * @method String.prototype.toUpperCaseFirst
     * @param  {String} delimiter : Delimiter between acronym.
     * @return {String} : StudlyCaps string.
     * @since  Release 1.0.0
     */
    ucFirst: {
      type : String,
      alias: ["toUpperCaseFirst"],
      body : function(delimiter) {
        return this.delimiterize(delimiter).toStudlyCaps(delimiter);
      }
    },

    /**
     * Convert StudlyCaps to camelCase.
     *
     * @author StewEucen
     * @method String.prototype.toLowerCaseFirst
     * @param  {String} delimiter : Delimiter between acronym.
     * @return {String} : StudlyCaps string.
     * @since  Release 1.0.0
     */
    lcFirst: {
      type : String,
      alias: ["toLowerCaseFirst"],
      body : function(delimiter) {
        return this.delimiterize(delimiter).camelize(delimiter);
      }
    }
  };

  // Set methods of IntactCase into each Object.
  for (var methodName in methods) {
    var info = methods[methodName];
    var methodNames = [methodName].concat(info.alias || []);
    for (var i in methodNames) {
      _setPrototypes(info.type, methodNames[i], info.body);
    }
  }

  /**
   * Set prototype by Object.defineProperty.
   *
   * @author StewEucen
   * @param  {Object}   aimObject  : Ojbect to set into the prototype.
   * @param  {Strng}    methodName : Method name of Intact Case.
   * @param  {Function} body       : Method body.
   * @return {Void}
   * @scope  in closure
   * @since  Release 1.0.0
   */
  function _setPrototypes(aimObject, methodName, body) {
    Object.defineProperty(
      aimObject.prototype,
      methodName,
      {
        configurable: true,  // false is immutable.
        enumerable  : false, // false is invisible.
        writable    : true,  // false is read-only.
        value       : body
      }
    );
  }

  /**
   * Escape delimiter for RegExp.
   *
   * @author StewEucen
   * @param  {String} delimiter : Delimiter.
   * @return {String} : Escaped delimiter.
   * @scope  in closure
   * @since  Release 1.0.0
   */
  var _escapeDelimiter = function() {
    var escapedLetters = ".?*+-^$[]{}()|\\";
    return function(delimiter) {
      var d = _complementDeilimiter(delimiter);
      return escapedLetters.indexOf(d) != -1 ? "\\" + d : d;
    }
  }();

  /**
   * Complete default deilimiter.
   *
   * @author StewEucen
   * @param  {String} delimiter : Delimiter.
   * @return {String} : Delimiter completed.
   * @scope  in closure
   * @since  Release 1.0.0
   */
  var _complementDeilimiter = function(delimiter) {
    return delimiter || "_";
  };

}((this || 0).self || global);
