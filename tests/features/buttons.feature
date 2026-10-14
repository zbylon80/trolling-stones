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
      | Zaproś nas na scenę | /kontakt | Kontakt |

  Scenario Outline: Primary CTAs on the English homepage navigate correctly
    Given I open the homepage in English
    When I click the control "<label>"
    Then I should be at path "<path>"
    And I should see heading "<heading>"

    Examples:
      | label       | path             | heading |
      | See shows   | /en/koncerty     | Shows   |
      | Book the band | /en/kontakt | Contact |

  Scenario: Cookie banner exposes localized buttons
    Given the cookie banner storage is cleared
    And I open the homepage
    Then I should see the button "Odrzuć"
    And I should see the button "Akceptuj wszystkie"

  Scenario: YouTube carousel controls have Polish labels
    Given I open the homepage
    Then I should see the button "Poprzedni klip"
    And I should see the button "Następny klip"

  Scenario: Gallery lightbox controls expose Polish aria-labels
    Given I open the page "/galeria"
    When I open the first lightbox image
    Then I should see the button "Zamknij podgląd"
    And I should see the button "Poprzednie zdjęcie"
    And I should see the button "Następne zdjęcie"
