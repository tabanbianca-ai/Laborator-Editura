import { UI_LOCALES, createUiTranslator, type UiLocale } from "../../lib/ui-i18n";

const localeLabels: Record<UiLocale, string> = {
  "ro-RO": "Română (România)",
  "en-US": "English (United States)",
  "en-GB": "English (United Kingdom)",
  "es-ES": "Español (España)",
  "fr-FR": "Français (France)",
  "pt-PT": "Português (Portugal)",
  "pt-BR": "Português (Brasil)",
  "it-IT": "Italiano (Italia)",
  "de-DE": "Deutsch (Deutschland)"
};

interface LocaleSwitcherProps {
  currentLocale: UiLocale;
}

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const ui = createUiTranslator(currentLocale);

  return (
    <form className="locale-switcher" method="get">
      <label htmlFor="platform-locale">{ui.t("language.switcher")}</label>
      <select defaultValue={currentLocale} id="platform-locale" name="locale">
        {UI_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {localeLabels[locale]}
          </option>
        ))}
      </select>
      <button className="ui-button ui-button-secondary ui-button-sm" type="submit">
        {ui.t("language.apply")}
      </button>
    </form>
  );
}
