using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Web
{
    public partial class demo : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Redirect("https://docs.google.com/spreadsheets/d/100k_wy0we3fjPswwVNZhysPSZJ3d8fbLj9e1mP9ql5I/edit?usp=sharing");
        }
    }
}