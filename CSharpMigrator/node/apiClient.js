import axios from 'axios';

export const apiUrl = "https://hopelink.crm.dynamics.com/api/data/v9.1/";
export const authHeader = {
    Cookie: "CrmOwinAuth=MAAAAB5ZYHcFFxHrqmOuET2bGGp0UMPZaN8Z5ptGCfodp8ZvrY7gvEAi33dj7lRswV6jBx-LCAAAAAAABAC1V1uP27gVnukMkk3atAsUyNui8xD0pZWt-yXoopUty7ZkXSz5IvvFoCjKkm3dKcuen9BfXTmTyW6ComjjKSETMkV-5zuHR58O725ubn5vNXHaz7J9jOQaR7c3tzd_aofvQB18IJ-aQFz6pw4-3z2325ufI4zz6mO3W-Gq04IFWVN1UoS7NEUDCH1EkCKgCRa2QJIoACJgRN4XEeQ4P-je3tzFVXUtxvUcAH5L8SRNsjTFkfeaa5lXY6Z--OKY6JR_xuTJF8L8eFl_WQ4jlICqk8SwzKosxB2YJV14AHFSdUGbG2mCcJQFVYlCVKIUououb4Lrg2_8RwJN1aVJUuySfDcOUIpjfP41qcsIBDjO0jitMEi_bCPLSi8SnldwE4Eqen-mzh7bny8lbxHHs_igrBARbq_3_udvvD8lhyoDeScrt59957rt9a3vVV2mIEGv5Tx_mAD_eh5__z4e2_iI0k9MXAQwPqDrmbyKcxAE5TuKETsS1aEYoUNx18PeX1j-4TPLhxeL27f793X2fhuuzN8hiJ9GwxiVHzieD0AAOCIQgoBgecAQUhD4BBQpFgakBEEgXk_ybZbmJUo2VRx0XYIiOIKmCIpiSZZkKEYiaIGmeVKSRJpgGJHlRZES2HZOu-kvEPi8joMfWyymp6qKPJBYjpPp63F_U0Y82ZFdUj5WTTEG43GPPK8Qtoa1dVocp1B-bs2XOxnLtti53vbvqnjbKs6mlRyM7vdJFV-PqXzfG3hJ618S6i89Ep8Hp5PtbHnHs0661BTVJEnocW4u6oIPS0gXlgkfl9v59ZS5_yn5MUpbgY6DD_8N-vXkbm9-rMDhH1GWo0Oc7i9xvB5U-r5NqvP0_0Dmrsbx-3I_5BytMdP9cDRmXbG_ZktZfgHwIyrvqM4LVHj3TRxUH3xBCv2QDQgGhVKrdKJEtBrHEALvUxKLRI4jpett_XBKqk2Sw_gVzUntbrxIDfD6Atpi3jP8CyF-otlUMb6nxBeCfJ-1izqwTDqXughn-zYDzzl6Z-UoHQf9LE3bL8_lrbi9edNaD87ppsT_fPN9Cipv5d7T3x49Pz82eDrQHYEol_42gL31WJ4qrX9jWbIJFCRoBCSfEGN2b8jJTngMFKGOzQ0-J1inVbHvJaIoIYtT7QDvj_Rg1KQhIU61BgwHBCjwtHb7SW_L03OVmOeESlu0TK3BGO9DLxDJCg2DohlMBX3szQhjae7npx4EiR3J9WgU2Yy_NbHYj-y-51pKbLozYrQ6w7Mex9a2tJO6WA8D5OiSUrJbXztGqkD4yUkXrILGPlJHeKlym0kuT3ZzAlL0UOxvzLYCnjKc2qxFxVsE5VIasgKPalWu5wq29X6toeECAS2HQWygRBahcAzW9n6dGVAlkr179opw-bhP_C0czeOQHjsjUXFEPXNdp4gCo6w3gdjUNBzXpqwKY3fqRmVjH_FK2y1Qrk0nMLPFCGQT38tnA9PSfWM4m8yUnbrY9ig402Y0Q-v5AnuR1FuT0VJ1c8myqc05947nx0gap3lNaCtP0bA-Nh240XsJ3I6cHiuoTkQ7zqSuuHC42_fgSHbpBb11ThJJ-mv10WeN8aoUBRo4zlCLZ1rZjK11H8ztGHrLxOlZs0TRN0pf8c2NnssDXyhOOugvVkStTmG6s8v1IfbUKebTybGa5mgR7-YbY28_jvecF3Gr1WbnsfiQuaf9kG6mHECusyI9uVwUy4kXMsBkdH2JD9JsbSeWRJ5iBpySY8jldRguDHGRYLC05M20TwLeyEiPnC0GJhxoRcqZ0764tLlHaNAqxuUCCKXZZ7hmq03m8LRUpR1O1Rlc7uhHjTfcGMT7YpPr-60KkzxWOWmqFMlZdE1GxtPGH9P2wGJsW2GHvGnW49RXJp6kjQhrXjoutbE59-iQ_aavuqG6WJxyc749JfC0mvao9ITX874iBOtDaikRwa3kiB80iJnUpKePFMMoQvvcrGhU9rJwNC_9nEGLQq8NWWRj25TRkPW4dTB_XMkYHbl5Mt-bo9LkQ6FXIhn28EabKHq0O3JHOndlsmVHKZk6sAhN6fkFdEbkBBSmF-2KelQN7ONZzwnFn5InF3s25U9HCctsEqfRgKcFyZ4cFbExctP0WKRw2BzPa9IOjV24mvBS1uNm9DJBYtRDslmN64gWNYJbSKaB6rXKuxNjltphAqZO7iN91T8fTUs8JAfkG1rzpE1vP2vTtvzlKMdRXz87_Jtnl3bpX7W_N50SBXHZ6t2fn0X1-cML0_L8SSRbHNCWK9WnSuVdp0JV1R4i3Us996E9XSPAkQFBsggRbY0MCeCLFCHSHACMT0LASH_stBUA3LtP68Zq2ZZhf3u2dsi2rRZ_qYaytDWNns7TWZJkaTe7aDTd_QTx2fRvOzkqq7hqqyR880OnPem3HlQ_GVn61wdSeLAgfqBJhnwgmY-s8JGhHobG7HUnrqoaBT8tUfCrWfTXs_4F4-yIbegRAAA;",
    //Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiJodHRwczovL2hvcGVsaW5rY25yeS5jcm0uZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMjEyYWNjYmUtMDhhMi00YzA3LTk4N2EtZDM4NmI4ZWM1NWJkLyIsImlhdCI6MTYwMjE2NTQ3MCwibmJmIjoxNjAyMTY1NDcwLCJleHAiOjE2MDIxNjkzNzAsImFpbyI6IkUyUmdZSERTTmQzdmVyRmhTcURocHh1bnM2VVRBUT09IiwiYXBwaWQiOiI0M2UxYTVhMi00ZmYxLTQ5N2UtYWNlZC0yN2Y0MDRkNjdkZjIiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yMTJhY2NiZS0wOGEyLTRjMDctOTg3YS1kMzg2YjhlYzU1YmQvIiwib2lkIjoiMjQyYTc2Y2MtOWJkZS00YWU4LThiYzctNmE4ZTdjM2E3Y2VlIiwicmgiOiIwLkFTMEF2c3dxSWFJSUIweVlldE9HdU94VnZhS2w0VVB4VDM1SnJPMG45QVRXZmZJdEFBQS4iLCJzdWIiOiIyNDJhNzZjYy05YmRlLTRhZTgtOGJjNy02YThlN2MzYTdjZWUiLCJ0aWQiOiIyMTJhY2NiZS0wOGEyLTRjMDctOTg3YS1kMzg2YjhlYzU1YmQiLCJ1dGkiOiJiQkJYQ0tqQU1VZVRIV0tTZ0twaUFBIiwidmVyIjoiMS4wIn0.lFOJZV9kzl8ryN4k45H7qVaZGb9vdxzhnLZkFYSRzONvKCplCKOj76sY0ISCtg8RWj53P8rgR7T9pDvOz5vgBtJ9q6NkgskDwHHVi2AOK4ZeTvRpnasIHaCI_Mvfa5zaduuu19JkU0iBueOIFV9tRdUxpVkCmx--I6Rc3hhKDaLCT2oenS4RYdVgZSvh6X86pzCrkfLwhvGCPN1IdWuIHn_y9aoJxZXOjSt4xAKWuYTDM0rsU4u0re8Sz6wfrSsOTloM9zlK2WGkOnLF4vg32TnfoRrZGDSBCU51NTkQOZ0Z7N6R97hVqMCkjf1GpLJmsUBLn9--A0RYabYcc7556w"
};

const odataHeaders = {
    "Content-Type": "application/json;charset=utf-8",
    Accept: "application/json",
    "OData-Version": "4.0",
    "OData-MaxVersion": "4.0",
    Prefer: "odata.include-annotations=OData.Community.Display.V1.FormattedValue"
}

export function getHttpClient(){
    const httpClient = axios.create({
        baseURL: apiUrl,
        headers: {
            ...authHeader,
            ...odataHeaders
        }
      });

      return httpClient;
}


export function getBasicHttpClient(){
    const httpClient = axios.create({
        baseURL: apiUrl
      });

      return httpClient;
}