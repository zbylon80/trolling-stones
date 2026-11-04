@gallery @ui
Feature: Gallery photo albums

  Scenario Outline: Visitors can browse a captioned album on a narrow screen
    Given I open the page "<path>"
    Then the gallery should show the main photos, promotional photos and concerts in order
    And the Blues Club album should credit the guests and caption Jary's photos
    And the gallery should open the WOŚP album with the caption "<caption>"

    Examples:
      | path         | caption                                                |
      | /galeria     | Zespół na tle scenografii gdańskiego finału WOŚP.       |
      | /en/galeria  | The band in front of the Gdańsk WOŚP stage backdrop.    |
