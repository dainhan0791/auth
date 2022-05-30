// https://pagination.js.org/
// let currentPage = 1
// const loadPage = (page) => {
//     currentPage = page
//     $.ajax({
//         url:`/accounts?page=${page}`,
//         type:'get',
//     })
//     .then( (data) => {
//         $('#content').html('')
//         for(let i = 0; i < data.length; i++) {
//             const element = data[i]
    
//             const item = $(`
//                 <h1>${element.username} : ${element.password}</h1>        
//             `)
    
//             $('#content').append(item)
//         }
//         console.log(data)
//     })
//     .catch( (err) => {
//         console.log(err)
//     })
// }
// const prevPage = () => {
//     currentPage++
//     $.ajax({
//         url:`/accounts?page=${currentPage}`,
//         type:'get',
//     })
//     .then( (data) => {
//         $('#content').html('')
//         for(let i = 0; i < data.length; i++) {
//             const element = data[i]
    
//             const item = $(`
//                 <h1>${element.username} : ${element.password}</h1>        
//             `)
    
//             $('#content').append(item)
//         }
//         console.log(data)
//     })
//     .catch( (err) => {
//         console.log(err)
//     })
// }
// const nextPage = () => {
//     currentPage--
//     $.ajax({
//         url:`/accounts?page=${currentPage}`,
//         type:'get',
//     })
//     .then( (data) => {
//         $('#content').html('')
//         for(let i = 0; i < data.length; i++) {
//             const element = data[i]
    
//             const item = $(`
//                 <h1>${element.username} : ${element.password}</h1>        
//             `)
    
//             $('#content').append(item)
//         }
//         console.log(data)
//     })
//     .catch( (err) => {
//         console.log(err)
//     })
// }

$('#pagination').pagination({
    dataSource: 'accounts?page=1',
    locator: 'data',
    pageSize: 2,
    totalNumberLocator: function(response) {
        // you can return totalNumber by analyzing response content
        return response.total
    },
    afterPageOnClick: function(event, pageNumber) {

        loadPage(pageNumber)
    },
    afterPreviousOnClick: function(event, pageNumber) {
        loadPage(pageNumber)
    },
    afterNextOnClick: function(event, pageNumber) {

        loadPage(pageNumber)

    }
})
const loadPage = (page) => {
    $('#content').html('')
    $.ajax({
            url:`/accounts?page=${page}`,
            type:'get',
    })
    .then( (account) => {  
        // console.log(account)
        for(let i = 0; i < account.data.length; i++) {
            const element = account.data[i]
        
            const item = $(`
                <h4>${element.username} : ${element.password}</h4>        
            `)
        
            $('#content').append(item)
        }
        
    })
    .catch( (err) => {
            console.log(err)
    })
}
loadPage(1)

