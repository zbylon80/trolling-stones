@contact @smoke
Feature: Contact page details

  Background:
    Given I open the kontakt page

  Scenario: Contact manager info is visible
    Then I should see manager details:
      | field  | value                     |
      | E-mail | booking@trollingstones.pl |
      | Tel.   | +48 509 243 245           |

  Scenario: Technical rider link is available
    Then the rider link should have text "Rider techniczny (PDF)" and href "/assets/Rider-techniczy-Trolling-Stones-25.03.2025.pdf"

  Scenario Outline: Social link is available
    Then the social link "<name>" should point to "<url>"

    Examples:
      | name      | url                                             |
      | Facebook  | https://www.facebook.com/stones3city            |
      | Instagram | https://www.instagram.com/trollnstones/?hl=en   |
      | TikTok    | https://www.tiktok.com/@trollnstones            |
      | YouTube   | https://www.youtube.com/@TRollnStones           |

  Scenario: English contact page shows localized content
    When I open the kontakt page in English
    Then the heading should be "Contact"
    And I should see manager details:
      | field | value                     |
      | Email | booking@trollingstones.pl |
      | Phone | +48 509 243 245           |
    And the rider link should have text "Technical rider (PDF)" and href "/assets/Rider-techniczy-Trolling-Stones-25.03.2025.pdf"
