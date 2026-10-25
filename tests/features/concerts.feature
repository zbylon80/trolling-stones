@concerts @ui
Feature: Researched concerts are available in both languages

  Scenario Outline: Older shows are collapsed by default and expand into a compact archive
    Given I open the page "<path>"
    Then older shows should expand into a compact list and collapse with the keyboard

    Examples:
      | path         |
      | /koncerty    |
      | /en/koncerty |

  Scenario Outline: Expanded older shows fit a narrow phone viewport
    Given I use a narrow viewport
    And I open the page "<path>"
    Then older shows should expand into a compact list and collapse with the keyboard

    Examples:
      | path         |
      | /koncerty    |
      | /en/koncerty |

  Scenario Outline: Private events have illustrations and well-spaced past Friday and Saturday dates
    Given I open the page "<path>"
    Then the private shows should have illustrations and well-spaced weekend dates

    Examples:
      | path         |
      | /koncerty    |
      | /en/koncerty |

  Scenario Outline: The complete archive is unique, newest first and excludes cancelled events
    Given I open the page "<path>"
    Then the concert archive should contain the researched shows
    And the concert archive should show local previews without duplicating the original photograph

    Examples:
      | path         |
      | /koncerty    |
      | /en/koncerty |

  Scenario Outline: The next Blues Club show has a start time and ticket link
    Given I open the page "<path>"
    Then the next concert should start at nineteen thirty with tickets available
    And the concert metadata should include the full archive and local start time

    Examples:
      | path         |
      | /koncerty    |
      | /en/koncerty |

  Scenario Outline: Archive sources remain external links in either language
    Given I open the page "<path>"
    Then the concert sources should link directly to the original reports

    Examples:
      | path         |
      | /koncerty    |
      | /en/koncerty |
