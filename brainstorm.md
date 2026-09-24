# Brainstorming

## Exercise 03
* First thought from skimming through the code is that the button simply uses router.back() instead of doing a smart check. Considering most people come from Google, the "Back to Jobs" button would simply bring them back to the Google page instead of the actual Athyna job list.
* Fix -> Logic that checks if the previous page is of the same domain, if so then go back, but if not, then navigate to the Athyna job list instead.

## DISCARDED - Make account creation easier
- Profile filling is currently based on CV or manual only; no LinkedIn.
- Does mention you can import it from the LinkedIn PDF auto-generated resumé, but going back to your profile to get the latest version means leaving the Athyna website, potentially finding something else that could grab the user's attention (considering LinkedIn itself would also try to keep the user's attention on their website instead).
    
    ![CleanShot 2026-09-24 at 09.15.35@2x.png](Super%20Task%20Product%20Engineer/CleanShot_2026-09-24_at_09.15.352x.png)
    
- **IDEA:** Login via LinkedIn?

    - **DISCARDED**: No easy way to get LinkedIn profile data while following Terms of Service (scraping is not at all a possibility), approval in the program takes weeks, not viable for the Super Task, but explorable in other contexts.
    
    - **Via Official API** (Requires LinkedIn Approval)
        
        To officially retrieve the experience history block of the logged-in user, you need to request access to the **Profile API**.
        
        1. **Configure the App:** Create an application in the [**LinkedIn Developer Portal**](https://developer.linkedin.com/).
        2. **Request the Product:** In the **Products** tab, you will need to apply for one of the enterprise programs that unlock advanced profile scopes (such as the *Community Management API* or *Talent Solutions*). LinkedIn reviews the use case, and the approval process usually takes 2 to 4 weeks.
        3. **OAuth 2.0 Flow (3-Legged):** The user clicks "Sign In with LinkedIn" on your system and authorizes the extended profile scope.
        4. **Endpoint:** Once the token is generated, you make an HTTP request including the version header required by LinkedIn:
        
        **http**
        
        ```
        GET https://api.linkedin.com/v2/me
        Authorization: Bearer {YOUR_ACCESS_TOKEN}
        X-RestLi-Protocol-Version: 2.0.0
        ```
        
        *(Note: To fetch detailed fields, LinkedIn uses a special syntax called **Projections**, e.g., `v2/me?projection=(id,firstName,lastName,positions...)`)*.
        
## Applying on Mobile

* Bring apply button up higher
* To compensate for the user leaving the website, add a modal "If you liked this, log in to get reminders/find similar roles as well!" between user click and external apply.
* Initial viewable page shows too little information
    * Solution: Change the summary to display more role-specific information like technologies used, remote/hybrid/in person, etc.
    * Fallback with suggested searches/results when no jobs are found (explicitly states "no jobs found, here's suggestions instead")