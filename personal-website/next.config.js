/** @type {import('next').NextConfig} */
const i18n = require('./shared/i18n/settings.js');

module.exports = {
  experimental: { appDir: true },
  
  i18n: {
    locales: i18n.LOCALES,
    defaultLocale: i18n.DEFAULT_LOCALE,
  }
};