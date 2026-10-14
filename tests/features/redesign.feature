@redesign @ui
Feature: Redesign keeps navigation and media usable

  Scenario: Mobile menu opens, closes with Escape and returns focus
    Given I use a mobile viewport
    And I open the homepage
    Then the mobile menu should be closed
    When I open the mobile menu
    Then the mobile menu should be open
    When I press Escape
    Then the mobile menu should be closed
    And focus should return to the mobile menu

  Scenario: Mobile navigation reaches the booking page
    Given I use a mobile viewport
    And I open the homepage
    When I open the mobile menu
    And I click the control "Kontakt"
    Then I should be at path "/kontakt"
    And I should see heading "Kontakt"

  Scenario: Rejecting media prevents loading YouTube and revoking permission removes the player
    Given the cookie banner storage is cleared
    And the YouTube player is stubbed
    And I open the homepage
    When I click the control "Odrzuć"
    Then a YouTube player should not be loaded
    When I click the control "Zezwól na YouTube i odtwórz"
    Then the latest YouTube player should be loaded
    When I click the control "Ustawienia multimediów"
    And I click the control "Odrzuć"
    Then a YouTube player should not be loaded
    And I should see the button "Zezwól na YouTube i odtwórz"

  Scenario: Cycling through clips before playback does not connect to YouTube
    Given I open the homepage
    When I click the control "Poprzedni klip"
    Then a YouTube player should not be loaded
    And the selected clip counter should be "05 / 06"

  Scenario Outline: Narrow layouts stay within the viewport
    Given I use a narrow viewport
    And I open the page "<path>"
    Then the page should fit the viewport

    Examples:
      | path         |
      | /            |
      | /kontakt     |
      | /en          |
      | /en/kontakt  |
      | /koncerty    |
      | /galeria     |
      | /en/galeria  |
      | /bio         |
      | /en/bio      |
      | /sklad       |
      | /en/sklad    |
      | /aktualnosci |
      | /en/aktualnosci |

  Scenario: Band metadata is valid and languages are linked
    Given I open the homepage
    Then the band metadata should be valid JSON
    And the language alternates should include Polish and English

  Scenario: Gallery filters show actual concert photographs
    Given I open the page "/galeria"
    When I click the control "Koncerty"
    Then the gallery should show 1 photographs
    When I click the control "Wszystkie"
    Then the gallery should show 7 photographs

  Scenario: Photo preview receives focus and restores it on close
    Given I open the page "/galeria"
    When I open the first lightbox image
    Then focus should be inside the photo preview
    When I press Escape
    Then the photo preview should close and restore focus

  Scenario: English photo preview has English controls
    Given I open the page "/en/galeria"
    When I open the first lightbox image
    Then I should see the button "Close preview"
    And I should see the button "Previous photo"
    And I should see the button "Next photo"

  Scenario: Past events do not advertise ticket purchases
    Given I open the page "/aktualnosci"
    Then the past Blues Club article should not offer tickets

  Scenario: The concert memory links to its actual story
    Given I open the page "/koncerty"
    When I follow the Blues Club memory
    Then I should reach the Blues Club story
