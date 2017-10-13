<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="road.aspx.cs" Inherits="Web.road" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <script>
        class Event {
            constructor(event, address, type, coordinate, description) {
                this.event = event;
                this.address = address;
                this.type = type;
                this.coordinate = coordinate;
                this.description = description;
            }
        }
        var events = { "accident": new Array(), "speed": new Array(), "hole": new Array(), "construction": new Array() };
        <% init(); %>
    </script>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
    <script src="map.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDqmRTK0wSYfL3f0wAg3oPFKVFGUX6Yuzw&libraries=geometry&callback=initMap" async defer></script>
    <title>Simple Map</title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <div id="map" style="width: 100%; height: 800px;"></div>
            <div style="width: 100%;">
                ※勾選在地圖上顯示事件※
                <input type="checkbox" id="checkAccident" />車禍
                <input type="checkbox" id="checkSpeed" />車速
                <input type="checkbox" id="checkHole" />坑洞
                <input type="checkbox" id="checkConstruction" />施工
            </div>
            <br />
            <table style="width: 100%;" border="1">
                <tr>
                    <th colspan="2">目前狀態資訊</th>
                </tr>
                <tr>
                    <td style="width: 15%;">目前座標</td>
                    <td id="LatLng" style="width: 85%;"></td>
                </tr>
                <tr>
                    <td style="width: 15%;">目前地址</td>
                    <td id="current" style="width: 85%;"></td>
                </tr>
                <tr>
                    <td style="width: 15%;">健康程度</td>
                    <td id="score" style="width: 85%;"></td>
                </tr>
                <tr>
                    <td style="width: 15%;">目前車速</td>
                    <td id="speed" style="width: 85%;"></td>
                </tr>
                <tr>
                    <td style="width: 15%;">去年同月車禍個數</td>
                    <td id="accident" style="width: 85%;"></td>
                </tr>
                <tr>
                    <td style="width: 15%;">施工個數</td>
                    <td id="construction" style="width: 85%;"></td>
                </tr>
                <tr>
                    <td style="width: 15%;">坑洞個數</td>
                    <td id="hole" style="width: 85%;"></td>
                </tr>
                <tr>
                    <td style="width: 15%;">偵測範圍(公尺)</td>
                    <td id="detect" style="width: 85%;"></td>
                </tr>
                <tr>
                    <td style="width: 15%;">移動拉軸變更偵測範圍</td>
                    <td style="width: 85%;">
                        <input type="range" min="100" max="1000" value="100" id="radius" /></td>
                </tr>
            </table>
            <br />
            <table style="width: 100%;" border="1">
                <tr>
                    <th colspan="2">事件資訊</th>
                </tr>
                <tr>
                    <td style="width: 15%;">事件類型</td>
                    <td id="event" style="width: 85%;"></td>
                </tr>
                <tr>
                    <td style="width: 15%;">位置描述</td>
                    <td id="address" style="width: 85%;"></td>
                </tr>
                <tr>
                    <td style="width: 15%;">詳細資訊</td>
                    <td id="description" style="width: 85%;"></td>
                </tr>
            </table>
            <br />
            <div style="width: 100%;" id="date"></div>
        </div>
    </form>
</body>
</html>
