let categoryUrl = 'https://dummyjson.com/products/category-list';
let productUrl = "https://dummyjson.com/products/category/";

$(document).ready(function(){

    // get category list

    $.ajax({
        url: categoryUrl,   //categoty url
        method: "GET",
        data:{},
        success:function(response){
            let html = "";
            var i = 0;
            response.forEach(cat => {
                if(i < 5){
                
                    let formatCat = cat.replace(/-/g, ' ')
                                        .toLowerCase()
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ');

                html +=  '<div class="card mx-3 text-center category" style="width: 8rem; height: 8rem;" id='+cat+'>';
                html +=  '<a href="#" class="text-decoration-none">';
                html +=  '<img src="images/'+cat+'.png" alt="" class="CardImage">';
                html +=  '<h5 class="fw-bold text-dark">'+formatCat+'</h5>';
                html +=  '</a>';
                html +=   '</div>';
                }
                i++;
            });
            $("#category").html(html);
        }
    })


$(document).on("click",".category", function () {
  var val = $(this).attr("id");
    $.ajax({
        url:productUrl+val,
        method:"GET",
        data: {},
        success:function(response){
            //console.log(response);
            //alert(val)

            let html = " ";

            response.products.forEach(product =>{
            
                html += '       <div class="col-lg-4 pt-4">';
                html += '             <div class="card mx-1" style="width: 15rem;">';
                html += '                  <img src="'+product.thumbnail+'" class="card-img-top" alt="...">';
                html += '                <div class="card-body">';
                html += '                  <h3 class="card-title">'+product.title+'</h3>';
                html += '                  <p class="card-text">'+product.warrantyInformation+'</p>';
                html += '                  <a href="#" class="Amount">'+product.price+'</a>';
                html += '                </div>';
                html += '            </div>';
                html += '      </div>';

            })
            $("#products").html(html);
        }
    })
})

})