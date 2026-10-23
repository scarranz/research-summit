using System; using System.IO; using System.IO.Compression; using System.Text; using System.Collections.Generic;
public static class PdfText {
  static int Find(byte[] b, string s, int from){ var p=Encoding.ASCII.GetBytes(s); for(int i=from;i<=b.Length-p.Length;i++){int j=0; while(j<p.Length&&b[i+j]==p[j]) j++; if(j==p.Length) return i;} return -1; }
  public static string Extract(string path){
    var b=File.ReadAllBytes(path); var sb=new StringBuilder(); int pos=0;
    while(true){ int s=Find(b,"stream",pos); if(s<0) break; int st=s+6; if(st<b.Length&&b[st]==13) st++; if(st<b.Length&&b[st]==10) st++;
      int e=Find(b,"endstream",st); if(e<0) break; var raw=new byte[e-st]; Array.Copy(b,st,raw,0,raw.Length); pos=e+9;
      byte[] data=null; try{ int off=(raw.Length>2&&raw[0]==0x78)?2:0; using(var ms=new MemoryStream(raw,off,raw.Length-off)) using(var ds=new DeflateStream(ms,CompressionMode.Decompress)) using(var o=new MemoryStream()){ ds.CopyTo(o); data=o.ToArray(); } }catch{ data=raw; }
      if(data==null||data.Length==0) continue; var t=Encoding.GetEncoding(28591).GetString(data);
      if(t.IndexOf("Tj")<0 && t.IndexOf("TJ")<0) continue; Walk(t,sb);
    }
    return sb.ToString();
  }
  static void Walk(string t, StringBuilder sb){
    int i=0; while(i<t.Length){ char c=t[i];
      if(c=='('){ int d=1; i++; var w=new StringBuilder(); while(i<t.Length&&d>0){ char x=t[i]; if(x==(char)92&&i+1<t.Length){ char n=t[i+1]; if(n=='n')w.Append('\n'); else if(n=='r'){} else if(n=='t')w.Append(' '); else if(char.IsDigit(n)){ int k=0; string oc=""; while(k<3&&i+1+k<t.Length&&char.IsDigit(t[i+1+k])){oc+=t[i+1+k];k++;} w.Append((char)Convert.ToInt32(oc,8)); i+=k+1; continue;} else w.Append(n); i+=2; continue;} if(x=='(')d++; if(x==')'){d--; if(d==0)break;} w.Append(x); i++; } sb.Append(w); i++; continue; }
      if(c=='T'&&i+1<t.Length&&(t[i+1]=='d'||t[i+1]=='D'||t[i+1]=='*'||t[i+1]=='m')){ sb.Append('\n'); i+=2; continue; }
      if(c=='E'&&i+1<t.Length&&t[i+1]=='T'){ sb.Append('\n'); i+=2; continue; }
      i++; }
  }
}
