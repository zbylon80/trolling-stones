@ui @polish
Feature: Polish copy keeps diacritics intact

  Scenario: Main navigation items use Polish diacritics
    Given I open the homepage
    Then the main navigation should list:
      | Koncerty    |
      | Galeria     |
      | Aktualności |
      | Bio         |
      | Skład       |
      | Kontakt     |

  Scenario: Homepage hero paragraph uses Polish diacritics
    Given I open the homepage
    Then the hero intro should be "Rock'n'roll z pulsującą energią. Sprawdź nasze koncerty, obejrzyj klipy i bądź na bieżąco z nowościami."

  Scenario: Concerts intro copy keeps Polish letters
    Given I open the page "/koncerty"
    Then the intro paragraph should be "Nadchodzące daty występów."

  Scenario: Contact lead paragraph uses Polish diacritics
    Given I open the kontakt page
    Then the contact lead text should be "Rezerwacje koncertów, media, współpraca."

  Scenario: Cookie banner message is written with Polish diacritics
    Given the cookie banner storage is cleared
    And I open the homepage
    Then the cookie message should be "Używamy plików cookie tylko w niezbędnym zakresie oraz do osadzania treści (np. YouTube). Szczegóły znajdziesz w polityce prywatności. Możesz zaakceptować lub odrzucić."
