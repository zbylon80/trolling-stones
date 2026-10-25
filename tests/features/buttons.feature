@ui @buttons
Feature: Button behaviour across locales

  Scenario Outline: Primary CTAs on the Polish homepage navigate correctly
    Given I open the homepage
    When I click the control "<label>"
    Then I should be at path "<path>"
    And I should see heading "<heading>"

    Examples:
      | label           | path         | heading       |
      | Zobacz koncerty | /koncerty    | Koncerty      |
      | Aktualności     | /aktualnosci | Aktualności   |

  Scenario Outline: Primary CTAs on the English homepage navigate correctly
    Given I open the homepage in English
    When I click the control "<label>"
    Then I should be at path "<path>"
    And I should see heading "<heading>"

    Examples:
      | label       | path             | heading |
      | See shows   | /en/koncerty     | Shows   |
      | Latest news | /en/aktualnosci  | News    |

  Scenario: Cookie banner exposes localized buttons
    Given the cookie banner storage is cleared
    And I open the homepage
    Then I should see the button "Odrzuć"
    And I should see the button "Akceptuj wszystkie"

  Scenario: YouTube carousel controls have Polish labels
    Given I open the homepage
    Then I should see the button "Poprzedni klip"
    And I should see the button "Następny klip"

  Scenario: Lightbox controls expose Polish aria-labels
    Given I open the kontakt page
    When I open the first lightbox image
    Then I should see the button "Zamknij podgląd"
    And I should see the hidden button "Poprzednie zdjęcie"
    And I should see the hidden button "Następne zdjęcie"
