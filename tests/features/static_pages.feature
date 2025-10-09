@ui @smoke
Feature: Static pages render correctly

  Scenario Outline: Each static page exposes the expected main heading
    Given I open the page "<path>"
    Then I should see heading "<heading>"

    Examples:
      | path            | heading                                       |
      | /               | TRolling Stones - oficjalna strona            |
      | /koncerty       | Koncerty                                      |
      | /aktualnosci    | Aktualności                                  |
      | /bio            | Bio                                           |
      | /galeria        | Galeria                                       |
      | /sklad          | Skład                                        |
      | /kontakt        | Kontakt                                       |
      | /en/            | TRolling Stones - official website            |
      | /en/koncerty    | Shows                                         |
      | /en/aktualnosci | News                                          |
      | /en/bio         | Bio                                           |
      | /en/galeria     | Gallery                                       |
      | /en/sklad       | Line-up                                       |
      | /en/kontakt     | Contact                                       |
