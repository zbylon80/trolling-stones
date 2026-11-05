@gallery @ui
Feature: Gallery photo albums

  Scenario Outline: The main gallery opens with concert energy on desktop and mobile
    Given I open the page "<path>"
    Then the concert mosaic should keep the crowd prominent and open only its own photos

    Examples:
      | path        |
      | /galeria    |
      | /en/galeria |

  Scenario Outline: Visitors can browse concert albums on a narrow screen
    Given I open the page "<path>"
    Then the gallery should show the main photos, promotional photos and concerts in order
    And the Blues Club album should credit the guests and caption Jary's photos
    And the WOŚP album should open without visible photo captions and keep the alt text "<alt>"

    Examples:
      | path         | alt                                                    |
      | /galeria     | Zespół na tle scenografii gdańskiego finału WOŚP.       |
      | /en/galeria  | The band in front of the Gdańsk WOŚP stage backdrop.    |
