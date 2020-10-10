import React from 'react'

const Footer=()=>{
    return(
        <div>
        <footer class="page-footer grey lighten-4">
          <div class="container">
            <div class="row">
              <div class="col l6 s12">
                <h5 class="grey-text text-darken-3">About</h5>
                <p class="grey-text text-darken-3">Instagram is developed by Gomathi Shankar P S for the purpose of connecting with the people. Create an account and connect with the people in this world. Violating the rules of Instragram may lead to serious issue.</p>
              </div>
              <div class="col l4 offset-l2 s12">
                <h5 class="grey-text text-darken-3">Links</h5>
                <ul>
                  <li><a href="https://www.facebook.com" class="waves-effect waves-light light-blue darken-3 btn-floating social facebook" >
                  <i class="fa fa-facebook" style={{fontSize:"20px"}}></i></a></li>
                  <li><a href="www.instagram.com" class="waves-effect waves-light  red darken-1 btn-floating social instagram">
                  <i class="fa fa-instagram"  style={{fontSize:"20px"}}></i></a></li>
                  <li><a href="https://www.facebook.com" class="waves-effect waves-light light-blue darken-1 btn-floating social facebook">
                  <i class="fa fa-linkedin"  style={{fontSize:"20px"}}></i></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer-copyright grey lighten-3">
            <div class="container grey-text text-darken-3 center">
            © 2020 Instagram
            </div>
          </div>
        </footer>
        </div>
    )
}

export default Footer;