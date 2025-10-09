@ui @language
Feature: Language switcher

  Scenario: Visitor can switch between Polish and English
    Given I open the homepage
    When I use the language toggle to switch to "English"
    Then I should be at path "/en"
    And the main navigation should list:
      | Shows   |
      | Gallery |
      | News    |
      | Bio     |
      | Line-up |
      | Contact |
    When I use the language toggle to switch to "Polski"
    Then I should be at path "/"
    And the main navigation should list:
      | Koncerty    |
      | Galeria     |
      | Aktualności |
      | Bio         |
      | Skład       |
      | Kontakt     |
