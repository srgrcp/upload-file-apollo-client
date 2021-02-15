import React, { useEffect, useState } from 'react'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'

export default function Home() {

    const [file, setFile] = useState()

    const changeFile = e => {
        if (!e.target.files) return
        setFile(e.target.files[0])
    }

    const httpLink = createUploadLink({
        uri: 'http://localhost:3000/query',
    })

    const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = 'eyJraWQiOiI5UlZGVGpOZFl0VWlyd09MTUhnNThNZFNuRE94MXRoa2VPT0FnNkx4b09RPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyYWU5MjRlMy0zZmIyLTRjM2YtYjg2Zi1mOTAyOWMzOTVkYTEiLCJldmVudF9pZCI6IjAyYzZkNjcxLTE4ZWUtNDRlMi05MjI5LTdjMWNmNDNmY2UwYiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MTI4OTQ4OTYsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX2dWbEwzVDA4TiIsImV4cCI6MTYxMzQwOTIyNSwiaWF0IjoxNjEzNDA1NjI1LCJqdGkiOiIwNDRjODgzYS0zODdkLTRkMzQtOGMzNi0zMjUyYTQ0NmMzNjYiLCJjbGllbnRfaWQiOiIxMzc3OHZkazFsanNxNGRsdDVucTd2czdlYSIsInVzZXJuYW1lIjoiMmFlOTI0ZTMtM2ZiMi00YzNmLWI4NmYtZjkwMjljMzk1ZGExIn0.Vs9btOfD4kGQ8MRMhaGqhVy0fyGku42n_TGp9I6UyCRx1rnGb_nSZGIydfUVWBzI3_kIPiYY4O6-38xybupSfOUu0ICA3kWlJPAm7UpXzZ5EryONR5xlt90qYEOhVUapZFyX6x_JlziuDL4W67o3EsSSrKkXgyrysIgr_nyxRYAq_kAq4N85GybI__fRwMt7slLtj3XrLT9EMWlbYVNDg7YXRT1zy2AdlhpzVUh5an28VSc8iEtGl6JOhZyDxtoo3tPXvk3VIJMvmPqdRoqs9eSR8wxSTSHzPKWBScvmLrNgF03et96-petIBEr2JftjmPU4Xik5loTnXqHzJIhAAA'
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            }
        }
    })

    useEffect(() => {
        if (!file) return
        console.log(file)
        const client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache()
        })
        const uploadExcelMutation = gql`
            mutation($input: GroupUsersFileInput!) {
                uploadGroupUsersFile(input: $input) {
                    success
                    message
                }
            }
        `
        const testQuery = gql`
            query{
                PQRSTypes(input: {first: 20}){
                    nodes{
                        id
                        description
                    }
                }
            }
        `
        client.mutate({
            mutation: uploadExcelMutation,
            variables: { input: { file, groupId: 1 } }
        })
        .then(data => {
            console.log(data)
        })
    }, [file])

    return (
        <div>
            <input type="file" onChange={changeFile} />
        </div>
    )
}
