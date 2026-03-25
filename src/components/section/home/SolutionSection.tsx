export default function SolutionSection() {
  return (
    <section className="mb-20 flex flex-col gap-6 px-10 text-center sm:px-2">
      <h2 className="text-primary">우리가 해결하는 문제</h2>
      <p className="mx-auto mb-12 max-w-3xl text-sm leading-relaxed text-gray-500 md:text-lg">
        차량 데이터는 방대하지만 이를 제대로 분석하고 예측 가능한 형태로 만드는
        기업은 많지 않습니다. Future Mobility AI는 데이터를 통해
        <strong className="ml-1 text-primary">
          사고를 예방하고 차량의 생명주기를 관리
        </strong>
        합니다.
      </p>
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        {[
          {
            title: "데이터 단절",
            desc: "차량마다 다른 데이터 표준으로 통합이 어렵습니다.",
          },
          {
            title: "예측 불가한 리스크",
            desc: "차량 고장이나 이상 징후를 사전에 알기 어렵습니다.",
          },
          {
            title: "신뢰 문제",
            desc: "데이터가 기업 자산으로만 취급되어 투명성이 낮습니다.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border bg-card p-6 shadow-md"
          >
            <h3 className="mb-3 text-xl font-semibold text-primary">
              {item.title}
            </h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
