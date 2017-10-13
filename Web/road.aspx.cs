using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Web
{
    public partial class road : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }
        public void init()
        {
            DB db = new DB();
            db.Connect("mysyu.ddns.net", "road", "road", "road");
            DataTable status = db.Select("SELECT * FROM status", null);
            DataTable events = db.Select(String.Format("SELECT event , address , type , coordinate , description FROM {0}", status.Rows[0]["status"].ToString().Equals("ON") ? "road" : "backup"), null);
            foreach( DataRow row in events.Rows )
            {
                Response.Write(String.Format("events['{0}'].push( new Event( '{1}' , '{2}' , '{3}' , '{4}' , '{5}' ) );\n", row["event"].ToString(), row["event"].ToString(), row["address"].ToString(), row["type"].ToString(), row["coordinate"].ToString(), row["description"].ToString()));
            }
            Response.Write(String.Format("var lastupdate = '資料更新時間:{0}';\n", status.Rows[0]["lastupdate"].ToString()));
            db.DisConnect();
        }
    }
}