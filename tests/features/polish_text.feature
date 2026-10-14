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
    Then the hero intro should be "Stonesowe riffy, sześciu muzyków i energia, którą najlepiej poczuć pod sceną."

  Scenario: Concerts intro copy keeps Polish letters
    Given I open the page "/koncerty"
    Then the intro paragraph should be "Widzimy się pod sceną."

  Scenario: Contact lead paragraph uses Polish diacritics
    Given I open the kontakt page
    Then the contact lead text should be "Spotkajmy się na Twojej scenie."

  Scenario: Cookie banner message is written with Polish diacritics
    Given the cookie banner storage is cleared
    And I open the homepage
    Then the cookie message should be "YouTube uruchomimy dopiero, gdy na to pozwolisz. Możesz włączyć odtwarzacz lub pozostać przy zdjęciach i linkach."
